import jwt from 'jsonwebtoken';

export default class Token{
    private static seed: string = 'este-es-el-seed-de-la-app';
    private static caducidad: string = '1h';

    constructor(){

    }

    static getJwtToken( payload: any): string{
        return jwt.sign({
            usuario: payload
        }, this.seed, {expiresIn: this.caducidad});
    } 

    static comprobarToken( usertoken: string ){
        return new Promise((resolve, reject)=>{
            jwt.verify( usertoken, this.seed, (err, decoded)=>{
                if( err ){
                    //no confiar
                    reject();
                }else{
                    //confiar
                    resolve(decoded);
                }
            })
        })
        
    }
}