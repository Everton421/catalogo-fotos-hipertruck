import path from 'node:path';
import { conn2, db_publico } from '../database/mysql-connection.ts';
import fs from 'node:fs/promises'


type resultVerifyPhoto = { SEQ:number, FOTO:string,PRODUTO:number}


export class CheckDeletedPhotos {

    private static normalizePhotoName(filename: string): string {
        const ext = path.extname(filename).toUpperCase();
        const name = path.basename(filename, path.extname(filename));
        return `${name}${ext}`;
    }

    private static fixMojibake(filename: string): string {
        try {
            const buf = Buffer.from(filename, 'latin1');
            const decoded = buf.toString('utf-8');
            if (decoded !== filename && /[^\x00-\x7F]/.test(decoded)) {
                return decoded;
            }
        } catch {
            return filename;
        }
        return filename;
    }

    static async verify(code:number,pathPhotos:string){
    
         const pastaMonitorada = path.resolve(pathPhotos);
         const datafolder = await fs.readdir(pastaMonitorada)

          const [ resultVerifyPhotoProduct ] = await conn2.query(`SELECT SEQ ,PRODUTO, FOTO FROM ${db_publico}.fotos_prod  
             where PRODUTO = '${code}' ;`);

                         const arrVerifyPhoto = resultVerifyPhotoProduct as resultVerifyPhoto[];

                          if(arrVerifyPhoto.length > 0 ){
                            for(const photo of arrVerifyPhoto){
                                const normalizedName = CheckDeletedPhotos.normalizePhotoName(photo.FOTO);

                                    const foundOnDisk = datafolder.some((photofolder) =>{
                                        const normalizedFolder = CheckDeletedPhotos.normalizePhotoName(photofolder);
                                        return normalizedFolder === normalizedName;
                                    })

                                    if(foundOnDisk){
                                            console.log(`[V] Foto encontrada ${photo.FOTO}... `);
                                        continue;
                                    }

                                    const correctedName = CheckDeletedPhotos.fixMojibake(normalizedName);

                                    if (correctedName !== normalizedName) {
                                        const foundAfterFix = datafolder.some((photofolder) => {
                                            const normalizedFolder = CheckDeletedPhotos.normalizePhotoName(photofolder);
                                            return normalizedFolder === correctedName;
                                        });

                                        if (foundAfterFix) {
                                            console.log(`[X] Foto ${photo.FOTO} com encoding corrompido, excluindo vínculo`);
                                            await conn2.query(`DELETE FROM ${db_publico}.fotos_prod WHERE PRODUTO = '${photo.PRODUTO}' AND SEQ = '${photo.SEQ}' AND FOTO= '${photo.FOTO}' `)
                                            continue;
                                        }
                                    }

                                    console.log(`[X] Foto ${photo.FOTO} não foi encontrada na pasta, efetuando exclusão`);
                                    await conn2.query(`DELETE FROM ${db_publico}.fotos_prod WHERE PRODUTO = '${photo.PRODUTO}' AND SEQ = '${photo.SEQ}' AND FOTO= '${photo.FOTO}' `)

                                }
                            }else{
                                
                                console.log(`[X] produto ${code} esta sem foto.`)

                            }
    }
}
