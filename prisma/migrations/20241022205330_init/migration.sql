-- CreateTable
CREATE TABLE "ai_interview_coach_prod_jobs" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "company_name" VARCHAR(255),
    "company_url" VARCHAR(2048),
    "jd_url" VARCHAR(2048),
    "jd_text" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interview_coach_prod_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_interview_coach_prod_profiles" (
    "id" SERIAL NOT NULL,
    "school" VARCHAR(255) NOT NULL,
    "major" VARCHAR(255) NOT NULL,
    "concentration" VARCHAR(255),
    "graduation_date" DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interview_coach_prod_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_interview_coach_prod_resumes" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "url" VARCHAR(2048),
    "text" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interview_coach_prod_resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_goals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "student_id" INTEGER,
    "name" VARCHAR(255),
    "description" VARCHAR(5000),
    "benchmarks" VARCHAR(5000),
    "present_levels" VARCHAR(5000),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_prompts" (
    "id" SERIAL NOT NULL,
    "prompt_key" VARCHAR(255),
    "temperature" DECIMAL,
    "user_prompt" VARCHAR(5000),
    "system_prompt" VARCHAR(5000),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_students" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" VARCHAR(255),
    "grade" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_users" (
    "id" SERIAL NOT NULL,
    "clerk_id" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),

    CONSTRAINT "development_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit2_activities" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "icon" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packit2_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit2_packing_items" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "is_packed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packit2_packing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit2_trips" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "low_weather" DECIMAL(4,1),
    "high_weather" DECIMAL(4,1),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packit2_trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit2_users" (
    "id" SERIAL NOT NULL,
    "is_male" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packit2_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit_activities" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "packit_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit_packing_items" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "is_packed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "packit_packing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit_trips" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "low_weather" DECIMAL(5,2) DEFAULT 0,
    "high_weather" DECIMAL(5,2) DEFAULT 0,
    "type" VARCHAR(10) NOT NULL,

    CONSTRAINT "packit_trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packit_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "packit_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preview_goals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "student_id" INTEGER,
    "name" VARCHAR(255),
    "description" VARCHAR(5000),
    "benchmarks" VARCHAR(5000),
    "present_levels" VARCHAR(5000),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preview_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preview_students" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" VARCHAR(255),
    "grade" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preview_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preview_users" (
    "id" SERIAL NOT NULL,
    "clerk_id" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),

    CONSTRAINT "preview_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_goals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "student_id" INTEGER,
    "name" VARCHAR(255),
    "description" VARCHAR(5000),
    "benchmarks" VARCHAR(5000),
    "present_levels" VARCHAR(5000),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_prompts" (
    "id" SERIAL NOT NULL,
    "prompt_key" VARCHAR(255),
    "temperature" DECIMAL,
    "user_prompt" VARCHAR(5000),
    "system_prompt" VARCHAR(5000),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_students" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" VARCHAR(255),
    "grade" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_users" (
    "id" SERIAL NOT NULL,
    "clerk_id" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),

    CONSTRAINT "production_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "title" TEXT NOT NULL,
    "placeholder" TEXT,
    "is_required" BOOLEAN DEFAULT false,
    "relations" TEXT[],
    "sub_title" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shaadi_toast_questions" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "title" TEXT NOT NULL,
    "placeholder" TEXT,
    "is_required" BOOLEAN DEFAULT false,
    "relations" TEXT[],
    "sub_title" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shaadi_toast_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "development_users_clerk_id_key" ON "development_users"("clerk_id");

-- CreateIndex
CREATE INDEX "idx_packit_activities_trip_id" ON "packit_activities"("trip_id");

-- CreateIndex
CREATE INDEX "idx_packit_packing_items_activity_id" ON "packit_packing_items"("activity_id");

-- CreateIndex
CREATE UNIQUE INDEX "packit_users_email_key" ON "packit_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "preview_users_clerk_id_key" ON "preview_users"("clerk_id");

-- AddForeignKey
ALTER TABLE "ai_interview_coach_prod_jobs" ADD CONSTRAINT "ai_interview_coach_prod_jobs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "ai_interview_coach_prod_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ai_interview_coach_prod_resumes" ADD CONSTRAINT "ai_interview_coach_prod_resumes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "ai_interview_coach_prod_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "development_goals" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "development_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "development_students" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "development_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packit2_activities" ADD CONSTRAINT "packit2_activities_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "packit2_trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packit2_packing_items" ADD CONSTRAINT "packit2_packing_items_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "packit2_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packit_packing_items" ADD CONSTRAINT "packit_packing_items_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "packit_activities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "packit_trips" ADD CONSTRAINT "packit_trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "packit_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "preview_goals" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "preview_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "preview_students" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "preview_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_goals" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "production_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_students" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "production_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
