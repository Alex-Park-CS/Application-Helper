-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "jobUrl" TEXT,
    "location" TEXT,
    "source" TEXT NOT NULL DEFAULT 'Other',
    "status" TEXT NOT NULL DEFAULT 'Saved',
    "dateFound" DATETIME,
    "dateApplied" DATETIME,
    "followUpDate" DATETIME,
    "resumeVersion" TEXT,
    "contactName" TEXT,
    "contactInfo" TEXT,
    "jobDescription" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");
