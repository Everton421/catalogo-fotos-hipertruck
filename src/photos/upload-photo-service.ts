
import   fs   from 'node:fs/promises';
import path from 'node:path';
import { UploadPhotoDriver } from './driver/upload-img.ts';
import { PhotosProductDataAcess } from './photos-product-data-acess.ts';



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
 
    /**
     *  Envia a foto para o host online e injeta o link na foto do banco de dados 
     * @param product 
     * @param sequence 
     * @param basePath 
     * @param fileName 
     * @returns 
     */
    async upload( product:number, sequence:number, basePath:string,  fileName:string ){
            try{
                const pathPhotoProduct = path.resolve(basePath, fileName);

                 const isExistsPhoto = await this.checkFileExists(pathPhotoProduct) 

                     if(!isExistsPhoto ){
                            throw new Error(`[X] imagen seq: ${sequence} do produto: ${product} não foi encontrada. `);
                        }
                     const base64Photo= await fs.readFile( pathPhotoProduct, 'base64' );
                       
                     const link = await this.driver.upload(base64Photo);
                     
                     if(link){
                         await this.photosProductDataAcess.updateLinkPhotoProduct(link, product, sequence)
                     }
                return link
            }catch(e:any){
                throw new Error(e);
            }
        }   

    private async checkFileExists(filePath:string){
        try {
                await fs.access(filePath);
            return true
        } catch (error) {
                return false
        }
    }

}
