-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tenantId" TEXT,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowBlock" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isTrigger" BOOLEAN NOT NULL DEFAULT false,
    "isBlock" BOOLEAN NOT NULL DEFAULT false,
    "input" TEXT NOT NULL,

    CONSTRAINT "WorkflowBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowBlockConditionGroup" (
    "id" TEXT NOT NULL,
    "workflowBlockId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "WorkflowBlockConditionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowBlockCondition" (
    "id" TEXT NOT NULL,
    "workflowBlockConditionGroupId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "variable" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "WorkflowBlockCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowBlockToBlock" (
    "id" TEXT NOT NULL,
    "fromBlockId" TEXT NOT NULL,
    "toBlockId" TEXT NOT NULL,
    "condition" TEXT,

    CONSTRAINT "WorkflowBlockToBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowId" TEXT NOT NULL,
    "tenantId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT,
    "duration" INTEGER,
    "endedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowInputExample" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workflowId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "input" TEXT,

    CONSTRAINT "WorkflowInputExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowBlockExecution" (
    "id" TEXT NOT NULL,
    "workflowExecutionId" TEXT NOT NULL,
    "workflowBlockId" TEXT NOT NULL,
    "fromWorkflowBlockId" TEXT,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "input" TEXT,
    "output" TEXT,
    "duration" INTEGER,
    "endedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "WorkflowBlockExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowVariable" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "WorkflowVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCredential" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "WorkflowCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowBlockToBlock_fromBlockId_toBlockId_key" ON "WorkflowBlockToBlock"("fromBlockId", "toBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowInputExample_workflowId_title_key" ON "WorkflowInputExample"("workflowId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowVariable_tenantId_name_key" ON "WorkflowVariable"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowCredential_tenantId_name_key" ON "WorkflowCredential"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlock" ADD CONSTRAINT "WorkflowBlock_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlockConditionGroup" ADD CONSTRAINT "WorkflowBlockConditionGroup_workflowBlockId_fkey" FOREIGN KEY ("workflowBlockId") REFERENCES "WorkflowBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlockCondition" ADD CONSTRAINT "WorkflowBlockCondition_workflowBlockConditionGroupId_fkey" FOREIGN KEY ("workflowBlockConditionGroupId") REFERENCES "WorkflowBlockConditionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlockToBlock" ADD CONSTRAINT "WorkflowBlockToBlock_fromBlockId_fkey" FOREIGN KEY ("fromBlockId") REFERENCES "WorkflowBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlockToBlock" ADD CONSTRAINT "WorkflowBlockToBlock_toBlockId_fkey" FOREIGN KEY ("toBlockId") REFERENCES "WorkflowBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowInputExample" ADD CONSTRAINT "WorkflowInputExample_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlockExecution" ADD CONSTRAINT "WorkflowBlockExecution_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlockExecution" ADD CONSTRAINT "WorkflowBlockExecution_workflowBlockId_fkey" FOREIGN KEY ("workflowBlockId") REFERENCES "WorkflowBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowBlockExecution" ADD CONSTRAINT "WorkflowBlockExecution_fromWorkflowBlockId_fkey" FOREIGN KEY ("fromWorkflowBlockId") REFERENCES "WorkflowBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVariable" ADD CONSTRAINT "WorkflowVariable_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCredential" ADD CONSTRAINT "WorkflowCredential_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
