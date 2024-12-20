import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { usuariosService, planejamento_mensal } from '../clientes.service';

@Component({
  selector: 'app-planejamento',
  templateUrl: './planejamento.page.html',
  styleUrls: ['./planejamento.page.scss'],
})
export class PlanejamentoPage implements OnInit {
  planejamentos: planejamento_mensal[] = [];
  meses: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  indiceMesAtual: number = new Date().getMonth();
  anoAtual: number = new Date().getFullYear();

  constructor(private navCtrl: NavController, private usuariosService: usuariosService) {}

  ngOnInit() {
    this.carregarPlanejamentos();
  }

  editarPlanejamento(ID: string) {
    this.navCtrl.navigateForward(`/editaplanejamento/${ID}`);
  }
  

  ionViewWillEnter() {
    this.carregarPlanejamentos(); // Recarrega os planejamentos sempre que a página entra
  }

  get mudancasMes(): string {
    return this.meses[this.indiceMesAtual];
  }

  anteriorMes() {
    this.indiceMesAtual = (this.indiceMesAtual - 1 + this.meses.length) % this.meses.length;
    this.carregarPlanejamentos(); 
  }

  proximoMes() {
    this.indiceMesAtual = (this.indiceMesAtual + 1) % this.meses.length;
    this.carregarPlanejamentos(); 
  }

  carregarPlanejamentos() {
    // Obtém o usuário logado do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Verifica se o usuário está logado e possui um ID
    if (!usuarioLogado || !usuarioLogado.ID) {
      console.error('Usuário não encontrado ou não autenticado.');
      return;
    }
  
    // Obtém o mês atual com base no índice
    const mesAtual = (this.indiceMesAtual + 1).toString().padStart(1, '0'); 
  
    // Carrega os planejamentos do usuário com o ID e filtra pelo mês
    this.usuariosService.getAll<planejamento_mensal>('planejamento_mensal', 'ID_usuario', usuarioLogado.ID).subscribe(
      (planejamentos: planejamento_mensal[]) => {
        // Filtra os planejamentos para o mês atual
        this.planejamentos = planejamentos.filter(
          p => p.mes === mesAtual
        );
        console.log(`Planejamentos carregados para ${this.mudancasMes}:`, this.planejamentos);
      },
      (error) => {
        console.error('Erro ao carregar planejamentos:', error);
      }
    );
  }
  

  excluirPlanejamento(ID: string) {
    this.usuariosService.Remover<planejamento_mensal>('planejamento_mensal', 'ID', ID).subscribe(
      () => {
        this.carregarPlanejamentos(); 
        console.log('Planejamento excluído com sucesso');
      },
      (error) => {
        console.error('Erro ao excluir planejamento:', error);
      }
    );
  }

  irParaSalvarPlanejamento() {
    this.navCtrl.navigateForward('/salvaplanejamento');
  }
}
