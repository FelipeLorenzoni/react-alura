import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './components/InputCustomizado';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component{

    constructor(){
        super();
        this.state = {lista: [], name:'', email:'', password:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
      }
    render(){
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
                    <InputCustomizado id="nome" type="text" name="name"value={this.state.name} onChange={this.setNome}  label="Nome" />
                    <InputCustomizado id="email" type="email" name="email"value={this.state.email} onChange={this.setEmail}  label = "E-mail"/>
                    <InputCustomizado id="nome" type="password" name="senha"value={this.state.senha} onChange={this.setSenha} label = "Senha"/>
                    <div className="pure-control-group">                                  
                        <label></label>
                        <BotaoSubmitCustomizado id="gravar"type="submit" label="Gravar"></BotaoSubmitCustomizado>
                    </div>
                </form>             
            </div>);
    }

    enviaForm(evento){
        evento.preventDefault();
        
        $.ajax({
          url:"http://localhost:1234/api/v1/autor",
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          crossDomain: true,
          data: JSON.stringify({name:this.state.name, email:this.state.email, password:this.state.password}),
          success: function(novalista) {
            PubSub.publish('atualiza-lista-autores',novalista);
          },
          error: function(resposta){
            if(resposta.status === 400) {
                new TratadorErros().publicaErros(resposta.responseJSON);
            }
          }
        });
      }
    setNome(evento){this.setState({name:evento.target.value});}

    setEmail(evento){this.setState({email:evento.target.value});}
    
    setSenha(evento){this.setState({password:evento.target.value});}
}
class TabelaAutores extends Component{

    
    render(){
        return (
            <div>            
                <table className="pure-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                </thead>
                    <tbody>
                    {
                        this.props.lista.map(function(autor){
                        return (
                        <tr key={autor.id}>
                        <td>{autor.name}</td>
                        <td>{autor.email}</td>
                        </tr>);
                        }) 
                    }
                    </tbody>
                </table> 
          </div>);
    }
}



export default class AutorBox extends Component{

  constructor(){
    super();
    this.state = {lista: []};
    this.atualizaListagem = this.atualizaListagem.bind(this);
  }
  
  atualizaListagem(novaLista) {
    this.setState({lista:novaLista});
  }

  componentDidMount(){
    $.ajax({
      url:"http://localhost:1234/api/v1/autor",
      dataType: 'json',
      crossDomain: true,
      success: function(resposta) {
        // console.table(resposta);
          this.setState({lista:resposta});
      }.bind(this)
    });

    PubSub.subscribe('atualiza-lista-autores',function(topico,novalista){
        this.setState({lista:novalista})
    }.bind(this));
    
  }
  render(){
    return(
      <div>
        <FormularioAutor callbacklistagem={this.atualizaListagem}/>
        <TabelaAutores lista={this.state.lista}/>
      </div>
    )
  }
}