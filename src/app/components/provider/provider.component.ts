import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  providers: any[] = []

  constructor(private providerService:ProviderService) { }

  ngOnInit(): void {
    this.getProviders();
  }

  getProviders(){
    this.providerService.getProviders().subscribe({
      next: (data) => {
        for(let item of data as Array<any>){
          var provider = {
            name: item.providerTranslation[0].name,
            description: item.providerTranslation[0].description,

            connString: item.provider.connectionString,
            table: item.provider.table
          };

          this.providers.push(provider);
        }
      },
      error: (err) => console.log(err)
    });
  }

  deleteProvider(event: MouseEvent, providerId: number) {
    event.stopPropagation();
  }

  editProvider(event: MouseEvent, providerId: number) {
    event.stopPropagation();
  }

  infoProvider(i:number) {
    console.log('Info Provider');
    console.log(this.providers[i])
  }

  goCreateProvider() {

  }



}
