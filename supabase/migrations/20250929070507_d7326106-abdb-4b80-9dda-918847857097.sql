-- Create public bucket for recipe images
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

-- Allow public read access to images in this bucket
create policy "Public can view recipe images"
  on storage.objects for select
  using (bucket_id = 'recipe-images');