
import { test } from 'node:test';
import { UploadIMGBB } from '../lib/imgbb.ts';
import { conn2, db_publico, db_vendas } from '../../database/mysql-connection.ts';
import { isAxiosError } from 'axios';
import { PhotosProductDataAcess } from '../photos-product-data-acess.ts';
import { UploadPhotosProductService } from '../upload-photo-service.ts';
import   path  from 'node:path' 

import fs from 'node:fs/promises'

test("TESTE", async ()=>{

try {
       const photosProductDataAcess = new PhotosProductDataAcess(conn2 as any , db_publico!, db_vendas! );
     
       // monta o objeto do servico de envio
      const uploadPhotosProductService = new UploadPhotosProductService(
         new UploadIMGBB(process.env.APIKEY_IMGBB!),
         photosProductDataAcess
      );
            // consulta o caminho das fotos 
           // const dataPathPhotos = await photosProductDataAcess.findPathphotos();

          //  const photo = await photosProductDataAcess.findPhotosProduct({
          //     PRODUTO:10688,
          //     SEQ:2
          //  });
               const basePathTest = import.meta.dirname
            const pathImgTest = '../../../imgs/2V5857521.png';

           const t=  path.join( basePathTest ,pathImgTest )
            fs.access(t).then(()=>console.log("OK, img encontrada.")).catch((e)=>console.log(e))

            const result = await uploadPhotosProductService.upload(11371, 1, 
                 basePathTest,
                   pathImgTest
                 )
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


