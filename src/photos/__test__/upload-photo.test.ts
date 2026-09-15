
import { test } from 'node:test';
import { PhotosProductDataAcess } from '../data/photos-product-data-acess.ts';
import { UploadIMGBB } from '../lib/imgbb.ts';
import { conn2, db_publico, db_vendas } from '../../database/mysql-connection.ts';
import { UploadPhotosProductService } from '../services/upload-photo-service.ts';
import { isAxiosError } from 'axios';




test("TESTE", async ()=>{

try {
       const photosProductDataAcess = new PhotosProductDataAcess(conn2 as any , db_publico!, db_vendas! );
     
    const uploadPhotosProductService = new UploadPhotosProductService(
        new UploadIMGBB(process.env.APIKEY_IMGBB!),
        photosProductDataAcess
    );

            const dataPathPhotos = await photosProductDataAcess.findPathphotos();
            const photo = await photosProductDataAcess.findPhotosProduct({
               PRODUTO:10688,
               SEQ:1
            });
    
    const result = await uploadPhotosProductService.upload(10688, 1,dataPathPhotos.FOTOS,  photo[0].FOTO!)
    console.log(result) 
 
} catch (error) {
      if(isAxiosError(error)){
         console.log(error.response) 
      }else{
         if( error instanceof Error){
            console.log( error.message) 
         }else{
            console.log( error) 
         }
      }
}

})


