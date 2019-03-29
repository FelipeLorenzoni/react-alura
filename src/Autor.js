import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './components/InputCustomizado';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';


export class FormularioAutor extends Component{

    constructor(){
        super();
        this.state = {lista: [], name:'', email:'', password:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
      }
    render(){
        return (<div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
          
        <InputCustomizado id="nome" type="text" name="name"value={this.state.name} onChange={this.setNome}  label="Nome" />
        <InputCustomizado id="email" type="email" name="email"value={this.state.email} onChange={this.setEmail}  label = "E-mail"/>
        <InputCustomizado id="nome" type="password" name="senha"value={this.state.senha} onChange={this.setSenha} label = "Senha"/>
        
          <div className="pure-control-group">                                  
            <label></label>
            <BotaoSubmitCustomizado id="gravar"type="submit" label="Gravar"></BotaoSubmitCustomizado>
            
          </div>
        </form>             

      </div>  );
    }

    enviaForm(evento){
        evento.preventDefault();
        console.log(JSON.stringify({name:this.state.name, email:this.state.email, password:this.state.password}));
        $.ajax({
          url:"http://localhost:1234/api/v1/autor",
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          crossDomain: true,
          data: JSON.stringify({name:this.state.name, email:this.state.email, password:this.state.password}),
          success: function(resposta) {
            this.setState({lista:resposta});
          }.bind(this),
          error: function(resposta){
            console.log(resposta);
            console.log("erro enviar");
          }
        });
      }
    setNome(evento){this.setState({name:evento.target.value});}

    setEmail(evento){this.setState({email:evento.target.value});}
    
    setSenha(evento){this.setState({password:evento.target.value});}
}

export class TabelaAutores extends Component{

    constructor(){
        super();
        this.state = {lista: []};
      }
      
        componentWillMount(){
          $.ajax({
            url:"http://localhost:1234/api/v1/autor",
            dataType: 'json',
            crossDomain: true,
            success: function(resposta) {
              // console.table(resposta);
               this.setState({lista:resposta});
            }.bind(this)
          });
        }
    render(){
        return (<div>            
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>email</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.lista.map(function(autor){
                    return (
                      <tr key={autor.id}>
                        <td>{autor.name}</td>
                        <td>{autor.email}</td>
                      </tr> 
                    );
                  }) 
                }
              </tbody>
            </table> 
          </div>  );
    }
}