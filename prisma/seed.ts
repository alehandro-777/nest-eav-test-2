console.log("SEED START");
import { prisma } from '../src/prisma';


async function main() {
  
  //  ----   QUEryes
    const q1 = await prisma.query.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'query1',
      params: `{
        "where":{
          "ent": { "in": [1,2,3,4,5  ] },
          "att": { "in": [1,2,3,4,5 ] },
          "ts": { "gte": "", "lt": ""  },
          "deletedAt": null
        }, 
        "select": {
          "ts": true,
          "ent": true,
          "att": true,
          "numVal": true,
          "strVal": true,
          "dtVal": true
        },
        "orderBy":  {
          "ts": "asc"
        },
        "take": 1000 
    }`,
    },
  });
    const q2 = await prisma.query.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'query2',
      params: `{
        "by": ["ent","att"],
        "where":{
          "ent": { "in": [1,2,3,4,5] },
          "att": { "in": [1,2,3,4,5] },
          "ts": { "gte": "", "lt": ""  },
          "deletedAt": null
        }, 
          "_avg": { "numVal": true },
          "_sum": { "numVal": true },
          "_count": true,
        "having": {
            "numVal": { "_avg": { "gt": 0 } }
        }
      }`,
    },
  });
    const q3 = await prisma.query.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'query3',
      params: `{
        "where":{
          "ent": { "in": [1,2,3,4,5] },
          "att": { "in": [1,2,3,4,5] },
          "ts": { "gte": "", "lt": ""  },
          "deletedAt": null
        }, 
          "_avg": { "numVal": true },
          "_sum": { "numVal": true }
    }`,
    },
  });

  //  ----   TEMPLATES
    const tm1 = await prisma.template.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'template1',
      queries: {connect:[{id:1}, ]}
    },
  });
    const tm2 = await prisma.template.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'template2',
      queries: {connect:[{id:1}, {id:2}, {id:3}, ]}
    },
  });
    const tm3 = await prisma.template.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'template3',
      queries: {connect:[{id:1}, {id:2}, {id:3}, ]}
    },
  });

  //  ----   RANGE TYPES
    const r1 = await prisma.range.upsert({
    where: { id: 1 },
    update: {},
    create: {
      min: 0,
      max:100,
    },
  });
    const r2 = await prisma.range.upsert({
    where: { id: 2 },
    update: {},
    create: {
      min: 0,
      max:1000,
    },
  });  

  //------------------------------------------------------
  //  ----   ATTR TYPES
    const t1 = await prisma.attrType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'text',
    },
  });
    const t2 = await prisma.attrType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'numeric',
    },
  });
    const t3 = await prisma.attrType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'date',
    },
  });
    const t4 = await prisma.attrType.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'time',
    },
  });
    const t5 = await prisma.attrType.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'datetime',
    },
  });
    const t6 = await prisma.attrType.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'bool',
    },
  });
    const t7 = await prisma.attrType.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'dropdown',
    },
  });
    const t8 = await prisma.attrType.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'blob',
    },
  });

//----------------------------------------------------
  //  ----   KV SET
    const s1 = await prisma.kVSet.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Кран',
    },
  });
    const s2 = await prisma.kVSet.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'ГПА',
    },
  });
//----------------------------------------------------
  //  ----   KV 
    const k1 = await prisma.kV.upsert({
    where: { id:1 },
    update: {},
    create: {
      setId: 1, 
      key:1,
      value: 'Состояние 1.1',
    },
  });
    const k2 = await prisma.kV.upsert({
    where: { id: 2 },
    update: {},
    create: {
      setId: 1, 
      key:  2,
      value: 'Состояние 1.2',
    },
  });
    const k3 = await prisma.kV.upsert({
    where: { id: 3 },
    update: {},
    create: {
      setId: 1, 
      key:  3,
      value: 'Состояние 1.3',
    },
  });
    const k4 = await prisma.kV.upsert({
    where: { id:4 },
    update: {},
    create: {
      setId: 2, 
      key:1,
      value: 'Состояние 2.1',
    },
  });
    const k5 = await prisma.kV.upsert({
    where: { id: 5 },
    update: {},
    create: {
      setId: 2, 
      key:  2,
      value: 'Состояние 2.2',
    },
  });
    const k6 = await prisma.kV.upsert({
    where: { id: 6 },
    update: {},
    create: {
      setId: 2, 
      key:  3,
      value: 'Состояние 2.3',
    },
  });
//--------------------------------------------------------------------------

  for (let i = 1; i < 100; i++) {
      const e = await prisma.entity.upsert({
        where: { id: i },
        update: {},
        create: {
          name: 'entity ' + i,
        },
      });      
  }

//--------------------------------------------------------------------

  for (let i = 1; i < 100; i++) {
    const a2 = await prisma.attribute.upsert({
      where: { id: i },
      update: {},
      create: {
        typeId: i % 2 +1,
        name: 'attr '+i,
        rangeId: i % 2 +1,
        KVSetId: i % 2 +1,
      },
    });      
  }

  for (let k = 0; k < 100; k++) {

    let ts = new Date("2025-01-01");
        ts.setHours(ts.getHours() + k); // +1 час
    for (let j = 1; j < 10; j++) {
      for (let i = 1; i < 10; i++) {
        let v = Math.random()*100;
        //console.log(i,j,k)
        const a2 = await prisma.value.upsert({
          where: { ent_att_ts: {  // составной уникальный ключ
                  ent: i,
                  att: j,
                  ts: ts, 
                } },
          update: {},
          create: {
            ts: ts,
            ent: i,
            att: j,
            numVal: v,
            strVal: v.toString(),
            dtVal: ts,
            createdAt: new Date(),
          },
        });      
      }
    }
  }
//---------------------------------------------------------------------
  const tb1 = await prisma.tableE.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'table1',
      query: 'query1'
    },
  });
  const tb2 = await prisma.tableE.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'table2',
      query: 'query2'
    },
  });
  const tb3 = await prisma.tableE.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'table3',
      query: 'query3'
    },
  });

  // table 1 test fill
  for (let k = 1; k < 1000; k++) {
    let ts = new Date("2025-01-01");
        ts.setHours(ts.getHours() + k); // +1 час
  
        let v = Math.random()*100;
        //console.log(i,j,k)
        const a2 = await prisma.table1.upsert({
          where: { id:k },
          update: {},
          create: {
            col2: v,
            col3: v,
            col4: v.toString(),
            col1: ts,
            col5: "Snring 1",
            col6: "true",
            createdAt: new Date(),
          },
        });      
      
  }
  //end table 1 test fill
  // table 1 columns
  const col1 = await prisma.columnE.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id:1,
      tab:1,
      key: "col1",
      name: 'Дата',
      typ:  5,
      ran:1,
      kvs:1,
    },
  });
  const col2 = await prisma.columnE.upsert({
    where: { id: 2 },
    update: {},
    create: {
      tab:1,
      id:2,
      ran:1,
      kvs:1,
      key: "col2",
      name: 'Параметр 1',
      typ:  2,
    },
  });
  const col3 = await prisma.columnE.upsert({
    where: { id: 3 },
    update: {},
    create: {
      tab:1,
      id:3,
      kvs:1,
      ran:1,
      key: "col3",
      name: 'Параметр 2',
      typ:  2,
    },
  });
  const col4 = await prisma.columnE.upsert({
    where: { id: 4 },
    update: {},
    create: {
      tab:1,
      id:4,
      kvs:1,
      ran:1,
      key: "col4",
      name: 'Text 3',
      typ:  1,
    },
  });
  const col5 = await prisma.columnE.upsert({
    where: { id: 5 },
    update: {},
    create: {
      tab:1,
      id:5,
      kvs:1,
      key: "col5",
      name: 'DropBox 4',
      typ:  7,
    },
  });
  const col6 = await prisma.columnE.upsert({
    where: { id: 6 },
    update: {},
    create: {
      tab:1,
      id:6,
      kvs:1,
      key: "col6",
      name: 'CheckBox 5',
      typ:  6,
    },
  });
  //end table 1 columns


  //console.log(a1);
}// -- end main()



//=== execute the main function =============================================================================================
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });





  