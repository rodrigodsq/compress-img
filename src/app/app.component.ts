import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import JSZip from 'jszip';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { PipesModule } from './core/pipes/pipes.module';

@Component({
  standalone: true,
  imports: [RouterModule, ProgressBarComponent, PipesModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  compressedImages: Array<ImageCompress> = [];
  compressing: boolean = false;
  maxFiles: number = 0;

  constructor(private imageCompress: NgxImageCompressService) {}

  onFilesSelected(event: any): void {
    this.compressedImages = [];
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      this.compressImages(files);
    }
  }

  compressImages(files: FileList): void {
    this.maxFiles = files.length;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log();
      this.compressImage(file, files.length);
    }
  }

  compressImage(file: File, maxFiles: number): void {
    this.compressing = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const base64Image = e.target.result;

      this.imageCompress.compressFile(base64Image, -1, 50, 50).then(
        (result) => {
          this.compressedImages.push({
            name: file.name,
            path: result,
          });
          this.compressing = !(this.compressedImages.length === maxFiles);
        },
        (error) => {
          console.error('Erro na compressão da imagem:', error);
        }
      );
    };

    reader.readAsDataURL(file);
  }

  downloadImage(index: number): void {
    const base64Image = this.compressedImages[index];
    const blob = this.dataURItoBlob(base64Image.path);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.compressedImages[index].name;
    document.body.appendChild(a);

    // Simula um clique para desencadear o download
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  downloadAllImages(): void {
    const zip = new JSZip();

    for (let i = 0; i < this.compressedImages.length; i++) {
      const base64Image = this.compressedImages[i];
      const blob = this.dataURItoBlob(base64Image.path);

      // Adiciona cada imagem ao arquivo ZIP
      zip.file(this.compressedImages[i].name, blob);
    }

    // Gera o arquivo ZIP
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Inicia o download do arquivo ZIP
      const zipUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = 'imagens_comprimidas.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  }
}

interface ImageCompress {
  name: string;
  path: string;
}
