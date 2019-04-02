import PubSub from 'pubsub-js';


export default class TratadorErros{

    
    publicaErros(erros){
        
        
        let a = erros;
        let b = [];
        b.push(a.errors.name);
        b.push(a.errors.email);
        b.push(a.errors.password);
        // console.log(b)

        for(var i=0;i<b.length;i++){
            var erro = b[i];
            PubSub.publish("erro-validacao",erro);
            // console.log(erro)
        }

        // for(var i=0;i<erros.length;i++){
        //     var erro = erros.errors[i];
        //     PubSub.publish("erro-validacao",erro);
        //     console.log(erro);

        // }
    }

}