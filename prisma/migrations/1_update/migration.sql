-- CreateTable
CREATE TABLE "classes" (
    "cls_id" SERIAL NOT NULL,
    "cls_ur" VARCHAR(12) NOT NULL,
    "cls_type" VARCHAR(20) NOT NULL,
    "cls_sku" VARCHAR(10) NOT NULL,
    "cls_desc" VARCHAR(150) NOT NULL,
    "cls_tags" VARCHAR[],
    "cls_height" SMALLINT NOT NULL DEFAULT 0,
    "cls_width" SMALLINT NOT NULL DEFAULT 0,
    "cls_weight" SMALLINT NOT NULL DEFAULT 0,
    "cls_mft" INTEGER,

    CONSTRAINT "classes_ix1" PRIMARY KEY ("cls_id")
);

-- CreateTable
CREATE TABLE "images" (
    "img_id" SERIAL NOT NULL,
    "img_ur" VARCHAR(12) NOT NULL,
    "img_doc" VARCHAR[],
    "img_refs" VARCHAR[],
    "img_note" VARCHAR(1000),
    "img_src" BYTEA,

    CONSTRAINT "images_ix1" PRIMARY KEY ("img_id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "inv_id" SERIAL NOT NULL,
    "inv_ur" VARCHAR(5) NOT NULL,
    "inv_desc" VARCHAR(30) NOT NULL,

    CONSTRAINT "inventories_ix1" PRIMARY KEY ("inv_id")
);

-- CreateTable
CREATE TABLE "operations" (
    "opr_id" SERIAL NOT NULL,
    "opr_ur" VARCHAR(12) NOT NULL,
    "opr_type" VARCHAR(20) NOT NULL,
    "opr_state" VARCHAR(20) NOT NULL,
    "opr_prt" INTEGER NOT NULL,
    "opr_note" VARCHAR(1000),
    "opr_entdate" TIMESTAMP(0) NOT NULL,
    "opr_duedate" TIMESTAMP(0),
    "opr_findate" TIMESTAMP(0),

    CONSTRAINT "operations_ix1" PRIMARY KEY ("opr_id")
);

-- CreateTable
CREATE TABLE "oprdetails" (
    "opd_id" SERIAL NOT NULL,
    "opd_opr" INTEGER NOT NULL,
    "opd_prd" INTEGER NOT NULL,
    "opd_qty" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "opd_val" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "opd_discount" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "opd_note" VARCHAR(150),

    CONSTRAINT "oprdetails_ix1" PRIMARY KEY ("opd_id")
);

-- CreateTable
CREATE TABLE "partners" (
    "prt_id" SERIAL NOT NULL,
    "prt_ur" VARCHAR(12) NOT NULL,
    "prt_name" VARCHAR(30) NOT NULL,
    "prt_alias" VARCHAR(30),
    "prt_address" VARCHAR(200),
    "prt_phone" VARCHAR[],
    "prt_email" VARCHAR(30),
    "prt_type" VARCHAR(20) NOT NULL,
    "prt_state" BOOLEAN NOT NULL DEFAULT true,
    "prt_account" INTEGER NOT NULL,

    CONSTRAINT "partners_ix1" PRIMARY KEY ("prt_id")
);

-- CreateTable
CREATE TABLE "products" (
    "prd_id" SERIAL NOT NULL,
    "prd_ur" VARCHAR(12) NOT NULL,
    "prd_cls" INTEGER NOT NULL,
    "prd_sku" VARCHAR(10) NOT NULL,
    "prd_unit" VARCHAR(20) NOT NULL,
    "prd_price" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "prd_type" VARCHAR(20),
    "prd_state" VARCHAR(20) NOT NULL,
    "prd_color" VARCHAR(30),
    "prd_desc" VARCHAR(100),
    "prd_qtb" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "products_ix1" PRIMARY KEY ("prd_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "trs_id" SERIAL NOT NULL,
    "trs_ur" VARCHAR(12) NOT NULL,
    "trs_opr" INTEGER,
    "trs_inv" INTEGER NOT NULL,
    "trs_type" VARCHAR(20) NOT NULL,
    "trs_state" VARCHAR(20) NOT NULL,
    "trs_entdate" TIMESTAMP(0) NOT NULL,
    "trs_duedate" TIMESTAMP(0) NOT NULL,
    "trs_findate" TIMESTAMP(0) NOT NULL,
    "trs_note" VARCHAR(1000),
    "trs_doc" VARCHAR[],

    CONSTRAINT "transactions_ix1" PRIMARY KEY ("trs_id")
);

-- CreateTable
CREATE TABLE "trsdetails" (
    "trd_id" SERIAL NOT NULL,
    "trd_trs" INTEGER NOT NULL,
    "trd_prd" INTEGER NOT NULL,
    "trd_qty" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "trd_note" VARCHAR(100),
    "trd_mfl" VARCHAR(12),

    CONSTRAINT "trsdetails_ix1" PRIMARY KEY ("trd_id")
);

-- CreateTable
CREATE TABLE "users" (
    "usr_id" SERIAL NOT NULL,
    "usr_ur" VARCHAR(12) NOT NULL,
    "usr_name" VARCHAR(30) NOT NULL,
    "usr_email" VARCHAR(30) NOT NULL,
    "usr_hash" VARCHAR NOT NULL,
    "usr_role" INTEGER NOT NULL,
    "usr_state" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_ix1" PRIMARY KEY ("usr_id")
);

-- CreateTable
CREATE TABLE "varclasses" (
    "vcs_id" SERIAL NOT NULL,
    "vcs_ur" VARCHAR(12) NOT NULL,
    "vcs_desc" VARCHAR(30) NOT NULL,

    CONSTRAINT "varclasses_ix1" PRIMARY KEY ("vcs_id")
);

-- CreateTable
CREATE TABLE "variants" (
    "var_id" SERIAL NOT NULL,
    "var_cls" INTEGER NOT NULL,
    "var_str" VARCHAR(20) NOT NULL,
    "var_abb" VARCHAR(3),
    "var_num" INTEGER,

    CONSTRAINT "variants_ix1" PRIMARY KEY ("var_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_cls_ur_key" ON "classes"("cls_ur");

-- CreateIndex
CREATE UNIQUE INDEX "classes_cls_sku_key" ON "classes"("cls_sku");

-- CreateIndex
CREATE UNIQUE INDEX "images_img_ur_key" ON "images"("img_ur");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_inv_ur_key" ON "inventories"("inv_ur");

-- CreateIndex
CREATE UNIQUE INDEX "operations_opr_ur_key" ON "operations"("opr_ur");

-- CreateIndex
CREATE UNIQUE INDEX "partners_prt_ur_key" ON "partners"("prt_ur");

-- CreateIndex
CREATE UNIQUE INDEX "products_prd_ur_key" ON "products"("prd_ur");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_trs_ur_key" ON "transactions"("trs_ur");

-- CreateIndex
CREATE UNIQUE INDEX "users_usr_ur_key" ON "users"("usr_ur");

-- CreateIndex
CREATE UNIQUE INDEX "users_usr_name_key" ON "users"("usr_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_usr_email_key" ON "users"("usr_email");

-- CreateIndex
CREATE UNIQUE INDEX "varclasses_vcs_ur_key" ON "varclasses"("vcs_ur");

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_fk1" FOREIGN KEY ("opr_prt") REFERENCES "partners"("prt_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oprdetails" ADD CONSTRAINT "oprdetails_fk1" FOREIGN KEY ("opd_opr") REFERENCES "operations"("opr_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oprdetails" ADD CONSTRAINT "oprdetails_fk2" FOREIGN KEY ("opd_prd") REFERENCES "products"("prd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_fk1" FOREIGN KEY ("prd_cls") REFERENCES "classes"("cls_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk1" FOREIGN KEY ("trs_inv") REFERENCES "inventories"("inv_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk2" FOREIGN KEY ("trs_opr") REFERENCES "operations"("opr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trsdetails" ADD CONSTRAINT "trsdetails_fk1" FOREIGN KEY ("trd_trs") REFERENCES "transactions"("trs_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trsdetails" ADD CONSTRAINT "trsdetails_fk2" FOREIGN KEY ("trd_prd") REFERENCES "products"("prd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variants" ADD CONSTRAINT "variants_fk1" FOREIGN KEY ("var_cls") REFERENCES "varclasses"("vcs_id") ON DELETE RESTRICT ON UPDATE CASCADE;

