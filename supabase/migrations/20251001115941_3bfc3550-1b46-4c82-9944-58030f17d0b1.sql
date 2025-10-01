-- Delete all existing recipe images from storage
DELETE FROM storage.objects WHERE bucket_id = 'recipe-images';