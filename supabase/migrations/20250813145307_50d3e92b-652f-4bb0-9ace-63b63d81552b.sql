-- Create storage bucket for AI builder files
INSERT INTO storage.buckets (id, name, public) VALUES ('ai_builder_files', 'ai_builder_files', false);

-- Create storage policies for AI builder files
CREATE POLICY "AI builders can view their own files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ai_builder_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "AI builders can upload their own files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ai_builder_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "AI builders can update their own files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'ai_builder_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "AI builders can delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'ai_builder_files' AND auth.uid()::text = (storage.foldername(name))[1]);