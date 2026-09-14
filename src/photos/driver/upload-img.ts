
export abstract class UploadPhotoDriver { 
      public  apiKey:string;
    
      constructor(  apiKey:string){
       this.apiKey =  apiKey;
     }
     
     abstract upload(photo:string):Promise<string | null >;
}