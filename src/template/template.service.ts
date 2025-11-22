import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { prisma } from '../prisma';
import { QueryService } from '../query/query.service';

import fs from "fs";
import { readFile } from 'fs/promises';
import * as path from 'path';
import * as ExcelJS from 'exceljs';



@Injectable()
export class TemplateService {

  constructor(private query: QueryService) {}

  create(createTemplateDto: CreateTemplateDto) {
    return prisma.template.create({data:createTemplateDto})
  }

  findAll() {
    return prisma.template.findMany({take:1000});
  }

  findOne(id: number) {
    return prisma.template.findFirst({ where:{id:id}});
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return prisma.template.update(
      { 
        where:{ id:id },
        data: updateTemplateDto,
      });
  }

  remove(id: number) {
    return prisma.template.delete({ where:{id:id} });
  }

  download(id: number) {

    const filePath = path.resolve(__dirname, '../json/template1.xlsx'); //temp
    const stat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath);

    return {readStream, stat, name:"template1.xlsx"};
  }

  //--------------------------------------------------------------------

  async exec(queryIds:string, ts:string, from:string, to:string, o:string, p:string) {

    const json = await this.processQuery(queryIds, ts, from, to, o, p); // test test data

    const excelTemplatePath = path.resolve(__dirname, '../json/template1.xlsx');  //template
    const outExcelPath = path.resolve(__dirname, '../json/data1.xlsx');         //output xlsx

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelTemplatePath);
    const worksheet = workbook.worksheets[0];
    
    this.processJson(worksheet, json);
   
    await workbook.xlsx.writeFile(outExcelPath);

    return "OK";
  }

  //temp temp 
  async processQuery(idsArr:string, ts:string, from:string, to:string, o:string, p:string) {
  /*
    let ids = [];
    let result: Map<string,any>[] = [];

    try {
      ids = JSON.parse(idsArr);
    } catch (e) {
      console.error(e);
    }

    console.log(ids  )

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let data = await this.query.exec(id, ts, from, to, o, p);
      //result.push(data)     
    }

    return result;
*/
    // TEST TEST
    const testData1Map = path.resolve(__dirname, '../json/data2.json');
    const data = JSON.parse(await readFile(testData1Map, 'utf8'));
    const ds0: Map<string, any> = new Map(Object.entries(data)); //temp test

    return [ds0, ds0];  //test test
  }

  //insert json - excel table
  processJson(sheet: ExcelJS.Worksheet, ds: Map<string, any>[]) {
    const startSym = "#";
  
    for (let rowId = 1; rowId <= sheet.rowCount; rowId++) {
      
      const row: ExcelJS.Row = sheet.getRow(rowId);
      const rowTotals: ExcelJS.Row | undefined = sheet.findRow(rowId+1);

      //step 1 : нужно ли размножить строку ? если да - размножить
      let isMulty = this.testIsMultiRow(row);

      if(isMulty)  {
        let bind = this.parseCellBinding(isMulty);
        let rowCount = this.getRowNumberByIndex(ds, +bind.ds);

        if(rowTotals)  {
          this.replaceColumnsTotalsFormulas(rowTotals, rowId, rowCount);
        }             
        this.insertEmptyRows(sheet, rowId, rowCount);
      }

      //step 2 : привязать данные строки
      for (let colId = 1; colId <= row.cellCount; colId++) {
        const cell = row.getCell(colId);

        //console.log('Cell ' + rowId +":"+ colId + ' ' + cell.value);        
        //rowset BINDING - cell format: #0.*.key,...	#0.*.1_1
        if(cell && typeof cell.value == "string" && cell.value.startsWith(startSym)) {
          //{ds, id, key} 
          let bind = this.parseCellBinding(cell.value);
          //select rowset row
          let dsKeyRow = this.getEntryByIndex(ds, +bind.ds, +bind.id);//map Entry [key, value]

          this.setCellValue(bind, cell, dsKeyRow);//значение -> в ячейку или генерирует JSON для Edit
        }

        //ENGLISCH text formula =SUM(**)
        if(cell && typeof cell.value == "string" && cell.value.startsWith("="))  {
          this.setCellFormulaValue(cell, rowId);  //ENG formula -> Excel formula
        }

      }//end columns for

    }

    //
  }
  
  //replace ENG =formula -> Excel format
  setCellFormulaValue(cell: ExcelJS.Cell, rowId: number) {
    if(cell && typeof cell.value == "string" && cell.value.startsWith("="))  {
        cell.value = cell.value.replaceAll("*", `${rowId}`);
        //console.log(rowId, cell.value)
        //  remove '='
        cell.value = { formula: cell.value.substring(1), };//excel standart
    }
  }

  //{"type":"numeric", "range":{"min":0, "max":100}, "cell":55.5, "save":{"ent":1, "att":1, "ts":"2025-12-11T22:00:00Z"}}
  //{"type":"dropdown", "source": ["yellow", "red", "orange", "green"], "cell":"red", "save":{"ent":1, "att":2, "ts":"2025-12-11T22:00:00Z"}}
  //{"type":"checkbox", "cell": true, "save":{"ent":3, "att":4, "ts":"2025-12-11T22:00:00Z"}}
  //{"type":"formula", "cell":"=SUM(D3:D12)", "save":{"ent":5, "att":3, "ts":"2025-12-11T22:00:00Z"}}
  //{"type":"datetime", "cell":"01.12.2025 08:00", "save":{"ent":4, "att":3, "ts":"2025-12-11T22:00:00Z"}}
  //{"type":"date", "cell":"15.11.2025", "save":{"ent":1, "att":5, "ts":"2025-12-11T22:00:00Z"}}
  //{"type":"time", "cell":"08:00", "save":{"ent":5, "att":3, "ts":"2025-12-11T22:00:00Z"}}
  //анализ привязки 
  setCellValue(bind: { ds: string; id: string; key: string; }, cell: ExcelJS.Cell, dsKeyRow: any[] | undefined) {
    //dsKeyRow - map Entry (dataset row) [key, value]
    if (bind.key == "key") {
      //dsKeyRow[0] - Map key, [1] - Value
      cell.value = dsKeyRow != undefined ? dsKeyRow[0] : ""; //display "key" test temp
    } else {

      let fieldKey = bind.key;
      //dsKeyRow[0] - Map key, [1] - Value
      if (dsKeyRow && dsKeyRow[1] && dsKeyRow[1][fieldKey]) {
        //dsKeyRow[0] - Map key, [1] - Value
        let newVal = dsKeyRow[1][fieldKey].numberVal; //temp  numberVal  !

        cell.value = newVal; //dsKeys[i]
      } else {
        cell.value = "";
      }
    }

  }

  getEntryByIndex(arr: Map<string, any>[], dsId: number, rowId: number) {
    const map0 = arr[dsId];  //
    let i = 0;
    for (const [key, value] of map0) {
      if (i++ === rowId) return [key, value];
    }
    return undefined;
  }
  
  getRowNumberByIndex(arr: Map<string, any>[], dsId: number) {
    const rowCount = arr[dsId].size;  //
    return rowCount;
  }


  //#0.*.key   replace rowId * with real dataset rowId
  replaceDsRowIdBindings(row: ExcelJS.Row, dsRowId: number) {
    for (let colId = 1; colId <= row.cellCount; colId++) {
      const cell = row.getCell(colId);
      if(cell && typeof cell.value == "string" && cell.value.startsWith("#")) {
        cell.value = cell.value.replace("*", dsRowId.toString());
        //console.log(dsRowId, cell.value);
      }
    }
  }

  //#0.*.key
  testIsMultiRow(row: ExcelJS.Row) {
    for (let colId = 1; colId <= row.cellCount; colId++) {
      const cell = row.getCell(colId);  
      if(cell && typeof cell.value == "string" && cell.value.includes("*") && cell.value.startsWith("#")) {     
        return cell.value;
      }
    }
    return null;
  }

  setRowValues(row: ExcelJS.Row, data:any) {
    for (let i = 1; i <= row.cellCount; i++) {
      //row.getCell(col+i).value = data[i].numberVal;
      //console.log(row, col+i, sheet.getCell(row, col+i).value)
    }
    
  }

  //insert + copy styles
  insertEmptyRows(sheet: ExcelJS.Worksheet, pos: number, num: number) {
    for (let id = 0; id < num - 1; id++) {      //нужно вставить на 1 меньше т.к. одна уже есть !
        const emptyRow = sheet.getRow(pos);   //она станет пустой после вставки
        const oldRow = sheet.getRow(pos+1);  //сюда сдвигается старая строка
        // Вставляем пустую строку
        sheet.spliceRows(pos, 0, []);
        this.copyValueAndRowStyle( oldRow, emptyRow); 
        //в старой строке подставить реальный номер строки датасета, но 1 самый последний!
        this.replaceDsRowIdBindings(oldRow, num-id-1);
    }
    //самая верхняя строка с 0 индексом
    const topRow = sheet.getRow(pos);
    this.replaceDsRowIdBindings(topRow, 0);
  }

  copyValueAndRowStyle(sourceRow: ExcelJS.Row, targetRow: ExcelJS.Row) {
    targetRow.height = sourceRow.height;
    sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const targetCell = targetRow.getCell(colNumber);
    targetCell.style = JSON.parse(JSON.stringify(cell.style)); // глубокая копия
    targetCell.numFmt = cell.numFmt;
    targetCell.value = cell.value;
    //console.log(colNumber, targetCell.style)
  });
  }

  async saveOnDisk()  {
        //const buffer = await this.workbook.xlsx.writeBuffer();
        //saveAs(new Blob([buffer]), 'edited.xlsx');
  }
  /*
  [..  "B1", // match[0] — полное совпадение
  "B",  // match[1] — буквы (колонка)
  "1"   // match[2] — цифры (строка)   ..]
  */
  parseCellRef(ref: string): { col: string; row: number } {
    const match = ref.match(/\$?([A-Z]{1,3})\$?(\d+)/);
    return match ? { col: match[1], row: parseInt(match[2], 10) } : { col: "", row: 0 };
  }

  //#0.*.key
  parseCellBinding(bind: string)  {
    const delim = ".";

    let parts = bind.split(delim);

    return {
            ds: parts[0].substring(1), 
            id:  parts[1],
            key: parts[2],
    }
  }

  replaceColumnsTotalsFormulas(sourceRow: ExcelJS.Row, fromRowId: number, rowwCount: number, ) {
    for (let colId = 1; colId <= sourceRow.cellCount; colId++) {
      const cell = sourceRow.getCell(colId);
      if(cell && typeof cell.value == "string" && cell.value.startsWith("=")) {
          let sub1 = cell.value.replace("*", "" + fromRowId);         // 1 *
          let sub2 = sub1.replace("*", `${fromRowId + rowwCount-1}`); // 2 *
          cell.value =  sub2;
          //console.log(sub2);
      }
    }
  }

  isCellEngFormula(cell: ExcelJS.Cell)  {
    if(cell && typeof cell.value == "string" && cell.value.startsWith("=")) {
      return true;
    }
    return false;  
  }

}

