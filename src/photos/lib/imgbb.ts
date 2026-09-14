import axios from 'axios';
import { UploadPhotoDriver } from '../driver/upload-img.ts';

export class UploadIMGBB extends UploadPhotoDriver{
  
   async upload(foto: string ): Promise<string | null> {
               let base64Input = foto;
            let base64Clean = String(base64Input);
            if (base64Clean.includes('base64,')) {
                base64Clean = base64Clean.split('base64,')[1];
            }
        
            const form = new FormData();
            form.append('image', base64Clean);

            try {
                const response = await axios.post(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, form, {
                        timeout: 60000,  
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data.data.url;
            } catch (error: any) {
                throw error;
            }
    }
   

}
