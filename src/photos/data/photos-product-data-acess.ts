
import mysql, { Pool, type ResultSetHeader } from 'mysql2';
import { type TableFotosProd } from '../interfaces/tabel_fotos_prod.ts';

export class PhotosProductDataAcess{
    private connection:   Pool; 
    private publicDatabase:string;
    private salesDatabase:string

    constructor(    connection: Pool,
      publicDatabase:string,
        salesDatabase:string
    ){
        this.connection = connection;
        this.publicDatabase= publicDatabase;
        this.salesDatabase= salesDatabase;
      }

      async findPhotosProduct ( query: Partial<TableFotosProd> , typeCondition?: "OR" | 'AND' ): Promise<TableFotosProd[]>{
                const params = [];
                const values =[];

            if(query.PRODUTO){
                params.push(' PRODUTO = ? ');
                values.push(query.PRODUTO);
            }
            if(query.SEQ){
                params.push(' SEQ = ? ');
                values.push(query.SEQ);
            }
            if(query.DESCRICAO){
                params.push(' DESCRICAO = ? ');
                values.push(query.DESCRICAO);
            }
            if(query.FOTO){
                params.push(' FOTO = ? ');
                values.push(query.FOTO);
            }
            if(query.LINK){
                params.push(' LINK = ? ');
                values.push(query.LINK);
            }   
            const baseSql = `SELECT  
              *,
            CAST(FOTO AS CHAR(10000) CHARACTER SET latin1) AS FOTO
             FROM ${this.publicDatabase}.fotos_prod`
            const whereClause = ' WHERE '
              
            const sql = baseSql + whereClause + params.join(typeCondition ? typeCondition : 'AND');
             const   [resultQuery]  = await this.connection.query(sql,values ) as any;
             return  resultQuery as  TableFotosProd[]; 
      } 

      async searchForUnsentPhotos (): Promise<TableFotosProd[]>{
            const sql = `SELECT  *,
            CAST(FOTO AS CHAR(10000) CHARACTER SET latin1) AS FOTO
             FROM ${this.publicDatabase}.fotos_prod 
             WHERE LINK IS NULL
             `
             const   [resultQuery]  = await this.connection.query(sql) as any;
             return  resultQuery as  TableFotosProd[]; 
      } 

      async findPathphotos(){
            const [result] = await this.connection.query(`SELECT 
                CAST(FOTOS AS CHAR(10000) CHARACTER SET latin1) AS FOTOS
                FROM ${this.salesDatabase}.parametros
                    `) as any;
                    return result[0] as { FOTOS:string} 
      }


      async updateLinkPhotoProduct (link:string, product:number, sequence: number){
        const sql= `UPDATE ${this.publicDatabase}.fotos_prod set LINK = ? WHERE PRODUTO = ? AND SEQ = ? `;
        const values =[ link, product, sequence];
       const result = await this.connection.query(sql,values) as any ;
        return result as ResultSetHeader;
      }

}