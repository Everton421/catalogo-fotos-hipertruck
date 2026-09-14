
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
 
    async upload( product:number, sequence:number, basePath:string,  fileName:string ){
            try{
                const pathPhotoProduct = path.resolve(basePath, fileName);

                    const base64Photo= await fs.readFile( pathPhotoProduct, 'base64' );
                    const link = await this.driver.upload(base64Photo);
                    
                    if(link){
                        await this.photosProductDataAcess.updateLinkPhotoProduct(link, product, sequence)
                    }
                return link
            }catch(e:any){
                console.log(e.response)
                throw new Error(e);
            }
        }   

}
