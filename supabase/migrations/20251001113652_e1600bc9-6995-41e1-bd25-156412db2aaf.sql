-- Delete all existing recipe images to force regeneration
DELETE FROM storage.objects 
WHERE bucket_id = 'recipe-images';