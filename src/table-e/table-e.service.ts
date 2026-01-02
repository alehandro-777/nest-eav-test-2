import { Injectable, NotFoundException } from '@nestjs/common';

import { prisma } from '../prisma';
import fs from "fs";
import { readFile } from 'fs/promises';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

import { ColumnEService } from 'src/column-e/column-e.service';
import { TableQueryService } from './table-query.service';
import { UpdateEdto } from './dto/update-table-e.dto';
import { CreateEdto } from './dto/create-table-e.dto';


@Injectable()
export class TableEService {
  
  constructor(private colServ: ColumnEService, private queryServ: TableQueryService) {}

  create(createTableEDto: CreateEdto) {
    return 'This action adds a new tableE';
  }

  findAll() {
    return prisma.tableE.findMany();
  }

  findOne(id: number) {
    return prisma.tableE.findFirst(
      { 
        where:{id:id},
      } );
  }

  update(id: number, updateTableEDto: UpdateEdto) {
    return `This action updates a #${id} tableE`;
  }

  remove(id: number) {
    return `This action removes a #${id} tableE`;
  }

  async query(id: number, ts:string, from:string, to:string, ) {
    let res = await this.queryServ.findMany(id, ts, from, to)
    return res;
  }


  
  //---------------------------------------------------------------------------------------------------
  async exec(id: number, ts:string, from:string, to:string, ) {
    
    //const template = await this.findOne(id);
    const template: any = {};//test
    template.name = "table1";//test
    template.query = 1;//test

    //console.log(template);

    if(!template) return null;

    const json = await this.processQuery(template.query, ts, from, to); // test test data

    const excelTemplatePath = path.resolve(__dirname, '../json/' + template.name + ".xlsx");    //template xlsx
    const outExcelPath = path.resolve(__dirname, '../json/'+ template.name + "_out" + ".xlsx"); //output xlsx

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelTemplatePath);
    const worksheet = workbook.worksheets[0];
  
    await this.processJson(worksheet, json, ts, from, to);
   
    await workbook.xlsx.writeFile(outExcelPath);

    return {result: "Ok", ts:new Date().toISOString()};
  }

  async processQuery(id: number, ts:string, from:string, to:string) {
    const tmp =  await this.queryServ.findMany(id, ts, from, to);

/*
    // TEST TEST
    const testData1Map = path.resolve(__dirname, '../json/table1.json');
    const data = JSON.parse(await readFile(testData1Map, 'utf8'));
    const ds0: Map<string, any> = new Map(Object.entries(data)); //temp test
    return new Map(Object.entries(ds0));  //test test
*/
    return tmp;
  }

  async processJson(sheet: ExcelJS.Worksheet, ds: Map<string, any>, ts:string, from:string, to:string) {
    const startSym = "#";
  
    for (let rowId = 1; rowId <= sheet.rowCount; rowId++) {
      
      const row: ExcelJS.Row = sheet.getRow(rowId);
      const rowTotals: ExcelJS.Row | undefined = sheet.findRow(rowId+1);
 
      let isMulty = this.testIsMultiRow(row);
      const rowCount = ds.size;

      if(isMulty)  {
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
          let dsKeyRow = this.getEntryByIndex(ds, +bind.id);  //map Entry [key, value]

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

  //#0.*.1.C2 всего 4 части запись всегда в себя
  parseCellBinding(bind: string)  {
    const delim = ".";

    let parts = bind.split(delim);

    return {
            ds: parts[0].substring(1), //всегда 0, это не используется
            id:  parts[1],  //row id
            key: parts[2],  //col id
            typ: parts[3],  //type for EDIT
            ent: parts[4],  //column # ?
            att: parts[5],  //not used         
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
  replaceDsRowIdBindings(row: ExcelJS.Row, dsRowId: number) {
    for (let colId = 1; colId <= row.cellCount; colId++) {
      const cell = row.getCell(colId);
      if(cell && typeof cell.value == "string" && cell.value.startsWith("#")) {
        cell.value = cell.value.replace("*", dsRowId.toString());
        //console.log(dsRowId, cell.value);
      }
    }
  }

  getEntryByIndex(arr: Map<string, any>, rowId: number) {
    const map0 = arr;  //
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
        dbVal = dsKeyRow[1][fieldKey];  // значение
        dbTs = dsKeyRow[0];  //row key ? ключ - метка времени 
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
    
    if (dbVal === null || dbVal === undefined) return "";

    const tmpV = Number(dbVal);
    //console.log("setDevaultValue dbVal, ",dbVal,tmpV)
    let tmp = Number.isFinite(tmpV) ? tmpV : dbVal;  //all is via string
    //console.log(dbVal, tmpV)
    return tmp;
  }

  async setNumberCellValue(bind: any, dbVal: any, dbTs:any) {

    //console.log(bind)

      const columnId = +bind.ent;  //column DB

      const att = await this.colServ.findOne(columnId);
      let tmpV: string|number = "";
      if (dbVal !== null && dbVal !== undefined) tmpV = Number(dbVal);
      //console.log("setNumberCellValue dbVal ", dbVal, tmpV)
      const tmp = {
        type: "numeric", 
        cell: Number.isFinite(tmpV) ? tmpV : "",  //all is via string
        range: att?.range,
        save: {
          row:  dbTs, 
          col:  bind.key, 
        },
      };

      return JSON.stringify(tmp);
  }
  async setTextCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "text", 
        cell: dbVal, 
        save: {
          row:  dbTs, 
          col:  bind.key,
        },
      };

      return JSON.stringify(tmp);
  }
  async setDateCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "date", 
        cell: dbVal,
        save: {
          row:  dbTs, 
          col:  bind.key,
        },
      };

      return JSON.stringify(tmp);
  }
  async setTimeCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "time", 
        cell: dbVal, 
        save: {
          row:  dbTs, 
          col:  bind.key,
        },
      };

      return JSON.stringify(tmp);
  }
  async setDateTimeCellValue(bind: any, dbVal: any, dbTs:any) {

      const tmp = {
        type: "datetime", 
        cell: dbVal, //temp test
        save: {
          row:  dbTs, 
          col:  bind.key,
        },
      };

      return JSON.stringify(tmp);
  }
  async setCheckBoxCellValue(bind: any, dbVal: any, dbTs:any) {
      const tmp = {
        type: "checkbox", 
        cell: dbVal === "true",  // странное преобразование ?
        save: {
          row:  dbTs, 
          col:  bind.key,
        },
      };

      return JSON.stringify(tmp);
  }
  async setDropBownCellValue(bind: any, dbVal: any, dbTs:any) {

      const columnId = +bind.ent;  //column froom DB

      const att = await this.colServ.findOne(columnId);
      let setKv: string[] = [];

      if(att && att.kVSet && att.kVSet.values) {
        setKv = att.kVSet.values.map(kv=> kv.value);
      }

      const tmp = {
        type: "dropdown", 
        cell: dbVal,
        source: setKv,
        save: {
          row:  dbTs, 
          col:  bind.key,
        },
      };

      return JSON.stringify(tmp);
  }

  //{"type":"formula", "cell":"=SUM(D3:D12)", "save":{"ent":5, "att":3, "ts":"2025-12-11T22:00:00Z"}}
  //replace ENG =formula -> Excel format
  setCellFormulaValue(cell: ExcelJS.Cell, rowId: number, ts:string, from:string, to:string) {
    if(cell && typeof cell.value == "string" && cell.value.startsWith("="))  {
        cell.value = cell.value.replaceAll("*", `${rowId}`);  //подстановка в размноженную строку
        //1 - результаты формулы сохранить ?
        // нет в таблице результаты формул не сохраняем

        //console.log(rowId, cell.value)
        //2 - simple cell  remove '='
        cell.value = { formula: cell.value.substring(1), };//excel standart
    }
  }

  testIsMultiRow(row: ExcelJS.Row) {
    for (let colId = 1; colId <= row.cellCount; colId++) {
      const cell = row.getCell(colId);  
      if(cell && typeof cell.value == "string" && cell.value.includes("*") && cell.value.startsWith("#")) {     
        return cell.value;
      }
    }
    return null;
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

  async download(id: number) {
    //const template = await this.findOne(id);
    const template:any = {};  //temp test
    template.name  ="table1";

    if(!template) return null;

    let fname = template.name + "_out" + ".xlsx";

    const filePath = path.resolve(__dirname, '../json/'+fname); //temp
    const stat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath);

    return {readStream, stat, name: fname };
  }

}
