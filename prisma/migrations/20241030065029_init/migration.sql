-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "birthday" INTEGER DEFAULT 0,
    "idCard" TEXT,
    "mark" TEXT,
    "partnerId" INTEGER,
    "addIp" TEXT,
    "addres" TEXT,
    "adminid" INTEGER NOT NULL DEFAULT 0,
    "avatar" TEXT,
    "brokeragePrice" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "gradeId" TEXT,
    "groupId" INTEGER,
    "integral" DECIMAL(65,30),
    "isDel" BOOLEAN NOT NULL DEFAULT false,
    "isPromoter" BOOLEAN NOT NULL DEFAULT false,
    "lastIp" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "loginType" TEXT,
    "nickname" TEXT NOT NULL,
    "nowMoney" DECIMAL(65,30),
    "payCount" INTEGER NOT NULL DEFAULT 0,
    "signNum" INTEGER NOT NULL DEFAULT 0,
    "spreadCount" INTEGER NOT NULL DEFAULT 0,
    "spreadTime" TIMESTAMP(3),
    "spreadUid" BIGINT NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userType" TEXT,
    "wxProfile" JSONB,
    "salt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
