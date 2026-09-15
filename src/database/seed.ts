import { Pool } from "mysql2"

export class Seed{
    private connection: Pool;

    constructor ( connection: Pool){
        this.connection =connection;
    }

    async exe( databasename:string ){
      const arrSql = [  
        ` CREATE DATABASE IF NOT EXISTS ${databasename}`,
        `CREATE TABLE IF NOT EXISTS  ${databasename}.fotos_prod_catalogo  (
            PRODUTO int(10) unsigned NOT NULL DEFAULT 0,
            SEQ int(10) unsigned NOT NULL DEFAULT 0,
            DESCRICAO varchar(50) DEFAULT NULL,
            FOTO longblob DEFAULT NULL,
            LINK varchar(100) DEFAULT NULL,
            DRIVER varchar(50) DEFAULT NULL,
          PRIMARY KEY (PRODUTO , SEQ , LINK , DRIVER ) USING BTREE
     ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Fotos do Produto';`,
    ];
        for(const sql of arrSql){
            await this.connection.query(sql);
        }

    }

}

