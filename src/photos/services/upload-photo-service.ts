
import   fs   from 'node:fs/promises';
import path from 'node:path';
import { UploadPhotoDriver } from '../driver/upload-img.ts';
import { PhotosProductDataAcess } from '../data/photos-product-data-acess.ts';



export class UploadPhotosProductService{

    private  driver: UploadPhotoDriver;
    private photosProductDataAcess: PhotosProductDataAcess;
    constructor(
        driver: UploadPhotoDriver, 
        photosProductDataAcess: PhotosProductDataAcess
    ){
        this.driver =driver;
         this.photosProductDataAcess= photosProductDataAcess;
    }
 
    async upload( product:number, sequence:number, pathPhotosERP:string ){
            try{
                const photosERP = path.resolve(pathPhotosERP);
                const datafolder = await fs.readdir(photosERP);
                    if(!datafolder.length){
                         throw new Error(`[V] Não foi encontrado foto do produto ${product} sequencia: ${sequence}`);
                    }
                    const photo = datafolder[0];

                    const base64Photo= await fs.readFile( path.join(photosERP,photo), 'base64' );
                    const link = await this.driver.upload(base64Photo);
                    
                    if(link){
                        await this.photosProductDataAcess.updateLinkPhotoProduct(link, product, sequence)
                    }
                return link
            }catch(e:any){
                throw new Error(e);
            }

        }   


}
