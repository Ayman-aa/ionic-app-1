import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private avatarService: AvatarService,
  ) {
    this.avatarService.getUserProfile().subscribe((data) =>{
      this.profile = data;
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/',{replaceUrl:true});
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,

    });
    
    if(image){
      const loading = await this.loadingController.create();
      await loading.present();

      const results = await this.avatarService.uploadImage(image);
      loading.dismiss();
     
      if(!results){
        const alert = await this.alertController.create({
          header:'Upload Failed',
          message:'There was a problem uploading your avatar',
          buttons:['OK'],
        });
        await alert.present();
      }
    }
  }

}
