-- CreateTable
CREATE TABLE "CommunitySetting" (
    "id" SERIAL NOT NULL,
    "whatsappLink" TEXT,
    "qrCodeUrl" TEXT,

    CONSTRAINT "CommunitySetting_pkey" PRIMARY KEY ("id")
);
