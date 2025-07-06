CREATE TABLE "Album" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Photo" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Album" ADD CONSTRAINT "Album_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_album_id_Album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."Album"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;