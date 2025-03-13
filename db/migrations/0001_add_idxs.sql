CREATE INDEX "authors_name_idx" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "authors_name_search_idx" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "book_editions_work_id_idx" ON "book_editions" USING btree ("work_id");--> statement-breakpoint
CREATE UNIQUE INDEX "book_editions_isbn_idx" ON "book_editions" USING btree ("isbn");--> statement-breakpoint
CREATE INDEX "book_editions_publisher_idx" ON "book_editions" USING btree ("publisher");--> statement-breakpoint
CREATE INDEX "book_editions_edition_idx" ON "book_editions" USING btree ("edition");--> statement-breakpoint
CREATE INDEX "book_editions_format_idx" ON "book_editions" USING btree ("format");--> statement-breakpoint
CREATE INDEX "book_editions_is_on_sale_idx" ON "book_editions" USING btree ("is_on_sale");--> statement-breakpoint
CREATE INDEX "book_editions_publisher_search_idx" ON "book_editions" USING btree ("publisher");--> statement-breakpoint
CREATE INDEX "book_editions_edition_search_idx" ON "book_editions" USING btree ("edition");--> statement-breakpoint
CREATE INDEX "book_likes_edition_id_idx" ON "book_likes" USING btree ("edition_id");--> statement-breakpoint
CREATE INDEX "book_likes_user_id_idx" ON "book_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "book_works_title_idx" ON "book_works" USING btree ("title");--> statement-breakpoint
CREATE INDEX "book_works_original_title_idx" ON "book_works" USING btree ("original_title");--> statement-breakpoint
CREATE INDEX "book_works_description_idx" ON "book_works" USING btree ("description");--> statement-breakpoint
CREATE INDEX "book_works_title_search_idx" ON "book_works" USING btree ("title");--> statement-breakpoint
CREATE INDEX "book_works_description_search_idx" ON "book_works" USING btree ("description");--> statement-breakpoint
CREATE INDEX "book_works_content_search_idx" ON "book_works" USING btree ("title","description");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "tags_name_search_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "work_to_authors_work_id_idx" ON "work_to_authors" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "work_to_authors_author_id_idx" ON "work_to_authors" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "work_to_tags_work_id_idx" ON "work_to_tags" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "work_to_tags_tag_id_idx" ON "work_to_tags" USING btree ("tag_id");