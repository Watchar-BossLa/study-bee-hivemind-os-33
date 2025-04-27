
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOCRUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadAndProcess = async (file: File) => {
    setIsUploading(true);
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');
      
      // Generate a unique path for the image
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('ocr-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ocr-images')
        .getPublicUrl(filePath);
        
      // Create upload record
      const { data: upload, error: recordError } = await supabase
        .from('ocr_uploads')
        .insert({
          image_url: publicUrl,
          status: 'pending',
          user_id: user.id
        })
        .select()
        .single();
        
      if (recordError) throw recordError;
      
      // Trigger processing
      const response = await supabase.functions.invoke('process-ocr', {
        body: { uploadId: upload.id }
      });
      
      if (response.error) throw response.error;
      
      toast({
        title: 'Upload successful',
        description: 'Your image is being processed. Flashcards will appear shortly.',
      });
      
      return upload.id;
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAndProcess,
    isUploading
  };
};
