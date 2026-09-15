import express, { type NextFunction,  type Request, type Response} from 'express';
import "express-async-errors";
import cors from 'cors';
import 'dotenv/config';
import path from 'path'; 
import { router } from './web/routes.ts';
import { JobPhotos } from './photos/job/job-verify-photos.ts';
import { PhotosProductDataAcess } from './photos/data/photos-product-data-acess.ts';
import { conn2, db_publico, db_vendas } from './database/mysql-connection.ts';
import { UploadIMGBB } from './photos/lib/imgbb.ts';
import { UploadPhotosProductService } from './photos/services/upload-photo-service.ts';
import { Seed } from './database/seed.ts';
import { Pool } from 'mysql2';
 
        const app = express();
             app.use(express.json({ limit: '150mb' })); 
            app.use(express.urlencoded({ limit: '150mb', extended: true }));

      app.set('view engine', 'ejs');
      app.set('views', path.join(import.meta.dirname!, 'web/Views'));
        app.use(express.static(path.join(import.meta.dirname!,  'public')));

        
        app.use(express.json());    
        app.use(router)
        app.use(cors());
        
        app.use(
                (err:Error, req:Request, res:Response, next:NextFunction)=>{
                    if(err instanceof Error){
                        return res.status(400).json({
                            error: err.message,
                        })
                    }
                    res.status(500).json({
                        status:'error ',
                        messsage: 'internal server error.'
                    })
                })

        /******************/
        if(!db_publico || !db_vendas || !process.env.APIKEY_IMGBB){

        }else{
            const  dataAcess = new PhotosProductDataAcess(conn2 as any, db_publico, db_vendas ) ;
            const  uploadPhotosProductService = new UploadPhotosProductService(   new UploadIMGBB(process.env.APIKEY_IMGBB),   dataAcess ) 
            const job = new JobPhotos(dataAcess, uploadPhotosProductService);
            await job.exec();
        }

        /******************/

        /******* SEED *********/
        // const seed = new Seed(conn2 as any);
        //  await seed.exe(`hipertruck_teste_catalogo`);
        /******************/

                const PORT_API = process.env.PORT_API; // Porta padrão para HTTPS

   app.listen(PORT_API, async ()=>{ 

    console.log(`app rodando porta ${PORT_API}  `)
    
})
   

