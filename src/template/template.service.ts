import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { prisma } from '../prisma';
import { QueryService } from '../query/query.service';

import fs from "fs";
import { readFile } from 'fs/promises';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { AttributeService } from 'src/attribute/attribute.service';



@Injectable()
export class TemplateService {

  constructor(private querySrv: QueryService, private attrSrv: AttributeService, ) {}

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
    
    await this.processJson(worksheet, json, ts, from, to);
   
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
  async processJson(sheet: ExcelJS.Worksheet, ds: Map<string, any>[], ts:string, from:string, to:string) {
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

          await this.setCellValue(bind, cell, dsKeyRow, ts, from, to);//значение -> в ячейку или генерирует JSON для Edit
        }

        //ENGLISCH text formula =SUM(**)
        if(cell && typeof cell.value == "string" && cell.value.startsWith("="))  {
          this.setCellFormulaValue(cell, rowId, ts, from, to);  //ENG formula -> Excel formula
        }

      }//end columns for

    }

    //
  }
  //{"type":"formula", "cell":"=SUM(D3:D12)", "save":{"ent":5, "att":3, "ts":"2025-12-11T22:00:00Z"}}
  //replace ENG =formula -> Excel format
  setCellFormulaValue(cell: ExcelJS.Cell, rowId: number, ts:string, from:string, to:string) {
    if(cell && typeof cell.value == "string" && cell.value.startsWith("="))  {
        cell.value = cell.value.replaceAll("*", `${rowId}`);  //подстановка в размноженную строку
        //1 - результаты формулы сохранить ?
        const parts = cell.value.split(".");  
        const cellObj = {
            for: parts[0],
            typ: parts[1],
            ent: parts[2],
            att: parts[3],            
        }
        if (cellObj.typ)  {
          //cell with DB save
          const tmp = {
            type: "formula", 
            cell: cellObj.for, 
            save:{
              ent:  cellObj.ent, 
              att:  cellObj.att, 
              ts: ts // temp ???
            },
          }
          cell.value = JSON.stringify(tmp);
          return; //end 1
        }

        //console.log(rowId, cell.value)
        //2 - simple cell  remove '='
        cell.value = { formula: cell.value.substring(1), };//excel standart
    }
  }

  //1 анализ привязки 
  async setCellValue(bind: any, cell: ExcelJS.Cell, dsKeyRow: any[] | undefined, ts:string, from:string, to:string) {
    //dsKeyRow - map Entry (dataset row) [key, value]
    if (bind.key == "key") {
      //dsKeyRow[0] - Map key, [1] - Value
      cell.value = dsKeyRow != undefined ? dsKeyRow[0] : ""; //display "key" поле,  test temp временно ???
      return;
    } 
      const fieldKey = bind.key;
      let dbVal = null;
      let dbTs = ts;
      //dsKeyRow[0] - Map key, [1] - Value
      if (dsKeyRow && dsKeyRow[1] && dsKeyRow[1][fieldKey]) {
        //dsKeyRow[0] - Map key, [1] - Value
        dbVal = dsKeyRow[1][fieldKey];    //??? временно
        dbTs = dsKeyRow[1][fieldKey].ts;  //??? временно
      }

    //2 editable cell

      switch (bind.typ) {
        case "C1":
          cell.value = await this.setTextCellValue(bind, dbVal, dbTs);      
          return;
        case "C2":
          cell.value = await this.setNumberCellValue(bind, dbVal, dbTs);      
          return;  
        case "C3":
          cell.value = await this.setDateCellValue(bind, dbVal, dbTs);      
          return;            
        case "C4":
          cell.value = await this.setTimeCellValue(bind, dbVal, dbTs);      
          return;            
        case "C5":
          cell.value = await this.setDateTimeCellValue(bind, dbVal, dbTs);      
          return;  
        case "C6":
          cell.value = await this.setCheckBoxCellValue(bind, dbVal, dbTs);      
          return;  
        case "C7":
          cell.value = await this.setDropBownCellValue(bind, dbVal, dbTs);      
          return;  

        //default:
        //  break;
      }
      //3 simple cell value
      cell.value = this.setDevaultValue(dbVal);
  }

  setDevaultValue(dbVal: any) {
    if(dbVal !== null) {
      if(dbVal.numberVal !== undefined && dbVal.numberVal !== null) {
        return dbVal.numberVal;
      } else {
        return dbVal.stringVal;
      }
    }
    return "";
  }

  async setNumberCellValue(bind: any, dbVal: any, dbTs:any) {

      const attId = +bind.att;  //range froom DB
      const att = await this.attrSrv.findOne(attId);

      const tmp = {
        type: "numeric", 
        cell: dbVal?.numberVal, 
        range: att?.range,
        save: {
          ent:  bind.ent, 
          att:  bind.att, 
          ts:   dbTs // temp ???
        },
      };

      return JSON.stringify(tmp);
  }
  async setTextCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "text", 
        cell: dbVal?.stringVal, 
        save: {
          ent:  bind.ent, 
          att:  bind.att, 
          ts:   dbTs // temp ???
        },
      };

      return JSON.stringify(tmp);
  }
  async setDateCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "date", 
        cell: dbVal?.stringVal, 
        save: {
          ent:  bind.ent, 
          att:  bind.att, 
          ts:   dbTs // temp ???
        },
      };

      return JSON.stringify(tmp);
  }
  async setTimeCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "time", 
        cell: dbVal?.stringVal, 
        save: {
          ent:  bind.ent, 
          att:  bind.att, 
          ts:   dbTs // temp ???
        },
      };

      return JSON.stringify(tmp);
  }
  async setDateTimeCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "datetime", 
        cell: dbVal?.stringVal, 
        save: {
          ent:  bind.ent, 
          att:  bind.att, 
          ts:   dbTs // temp ???
        },
      };

      return JSON.stringify(tmp);
  }
  async setCheckBoxCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "checkbox", 
        cell: dbVal?.stringVal, 
        save: {
          ent:  bind.ent, 
          att:  bind.att, 
          ts:   dbTs // temp ???
        },
      };

      return JSON.stringify(tmp);
  }
  async setDropBownCellValue(bind: any, dbVal: any, dbTs:any) {

      const attId = +bind.att;  //range froom DB
      const att = await this.attrSrv.findOne(attId);
      let setKv: string[] = [];

      if(att && att.kVSet && att.kVSet.values) {
        setKv = att.kVSet.values.map(kv=> kv.value);
      }

      const tmp = {
        type: "dropdown", 
        cell: dbVal?.stringVal, 
        source: setKv,
        save: {
          ent:  bind.ent, 
          att:  bind.att, 
          ts:   dbTs // temp ???
        },
      };

      return JSON.stringify(tmp);
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
  //#0.*.key
  parseCellBinding(bind: string)  {
    const delim = ".";

    let parts = bind.split(delim);

    return {
            ds: parts[0].substring(1), 
            id:  parts[1],
            key: parts[2],
            typ: parts[3],
            ent: parts[4],
            att: parts[5],            
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

