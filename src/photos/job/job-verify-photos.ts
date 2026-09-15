import cron from 'node-cron';
import { PhotosProductDataAcess } from '../data/photos-product-data-acess.ts';
import { UploadPhotosProductService } from '../services/upload-photo-service.ts';
import { delay } from '../../utils/delay.ts';
import { isAxiosError } from 'axios';

export class JobPhotos{
    private photosProductDataAcess:PhotosProductDataAcess;
    private uploadPhotosProductService:UploadPhotosProductService;

    constructor(photosProductDataAcess:PhotosProductDataAcess, uploadPhotosProductService:UploadPhotosProductService ){
      this.photosProductDataAcess=photosProductDataAcess;
      this.uploadPhotosProductService =uploadPhotosProductService;
    }

      async exec (){

        const CRON_JOB = process.env.CRON_JOB || '*/30 6-20 * * 1-6';

         let inExec = false;
                console.log("[V] Tarefa de upload de fotos agendada com sucesso!");
                console.log(CRON_JOB);
        
        cron.schedule( CRON_JOB , async () => {

            if (inExec) {
                console.log("[X] Tarefa de upload de fotos ainda em execução.");
                return;
            }
            const dataPathPhotos = await this.photosProductDataAcess.findPathphotos();

            try {
                inExec = true;
                    const dataPhotosToSend = await this.photosProductDataAcess.searchForUnsentPhotos();
                    
                    for(const photo of dataPhotosToSend ){
                        try{
                              await delay(2500, `Envio de imagen`)
                        const resultUploadPhoto = await this.uploadPhotosProductService.upload(photo.PRODUTO, photo.SEQ, dataPathPhotos.FOTOS, photo.FOTO! );
                            if(resultUploadPhoto){
                                console.log(`[V] Foto do produto ${photo.PRODUTO}, sequencia: ${photo.SEQ} enviada com sucesso!`)
                            }
                        }catch(e){
                             if(isAxiosError(e)){
                                     console.log(e.response) 
                                     if(e.response?.status == 400 && e.response?.data.error.message == 'Rate limit reached.'){
                                        await delay(5000, 'Envio de imagen')
                                     }  
                                  }else{
                                     if( e instanceof Error){
                                        console.log( e.message) 
                                     }else{
                                        console.log( e) 
                                     }
                                  }
                        }
                    }

            } catch (e) {
                console.error("Erro na tarefa de  upload fotos ", e);
            } finally {
                inExec = false;
            }
            
       });
        
    }
}