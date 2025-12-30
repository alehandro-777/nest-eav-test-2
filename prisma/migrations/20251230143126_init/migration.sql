-- CreateTable
CREATE TABLE "Entity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "rangeId" INTEGER,
    "KVSetId" INTEGER,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Value" (
    "id" SERIAL NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "ent" INTEGER NOT NULL,
    "att" INTEGER NOT NULL,
    "strVal" TEXT NOT NULL,
    "numVal" DOUBLE PRECISION,
    "dtVal" TIMESTAMP(3),
    "blbVal" BYTEA,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KVSet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "KVSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KV" (
    "id" SERIAL NOT NULL,
    "setId" INTEGER NOT NULL,
    "key" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "KV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Range" (
    "id" SERIAL NOT NULL,
    "min" DOUBLE PRECISION,
    "max" DOUBLE PRECISION,

    CONSTRAINT "Range_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttrType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AttrType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Query" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "params" TEXT NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableE" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,

    CONSTRAINT "TableE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColumnE" (
    "id" SERIAL NOT NULL,
    "tab" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typ" INTEGER NOT NULL,
    "ran" INTEGER,
    "kvs" INTEGER,

    CONSTRAINT "ColumnE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table1" (
    "id" SERIAL NOT NULL,
    "col1" TIMESTAMP(3),
    "col2" DOUBLE PRECISION,
    "col3" DOUBLE PRECISION,
    "col4" TEXT NOT NULL,
    "col5" TEXT NOT NULL,
    "col6" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Table1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QueryToTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_QueryToTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Value_ent_att_ts_key" ON "Value"("ent", "att", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "KV_setId_key_key" ON "KV"("setId", "key");

-- CreateIndex
CREATE INDEX "_QueryToTemplate_B_index" ON "_QueryToTemplate"("B");

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AttrType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_rangeId_fkey" FOREIGN KEY ("rangeId") REFERENCES "Range"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_KVSetId_fkey" FOREIGN KEY ("KVSetId") REFERENCES "KVSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_ent_fkey" FOREIGN KEY ("ent") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_att_fkey" FOREIGN KEY ("att") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KV" ADD CONSTRAINT "KV_setId_fkey" FOREIGN KEY ("setId") REFERENCES "KVSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnE" ADD CONSTRAINT "ColumnE_typ_fkey" FOREIGN KEY ("typ") REFERENCES "AttrType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnE" ADD CONSTRAINT "ColumnE_ran_fkey" FOREIGN KEY ("ran") REFERENCES "Range"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnE" ADD CONSTRAINT "ColumnE_kvs_fkey" FOREIGN KEY ("kvs") REFERENCES "KVSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnE" ADD CONSTRAINT "ColumnE_tab_fkey" FOREIGN KEY ("tab") REFERENCES "Table1"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QueryToTemplate" ADD CONSTRAINT "_QueryToTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "Query"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QueryToTemplate" ADD CONSTRAINT "_QueryToTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
