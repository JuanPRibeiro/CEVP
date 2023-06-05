import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage,  } from '@angular/fire/compat/storage';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private file: string;
  private src: string;
  private user: any;

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  previewImage(event: any) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;

    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElements = document.getElementsByClassName("profileImg") as HTMLCollectionOf<HTMLImageElement>;

      imagePreviewElements[0].src = imageSrc;
      imagePreviewElements[0].style.display = "block";

      this.file = imageFiles[0];
      this.src = imageSrc;
    }
  }

  async updateUserData(displayName: string) {
    this.src = this.user.photoURL;

    if (this.file != null) {
      this.storage.upload("users/" + this.user.uid, this.file).then(() => {
        const storage = getStorage();

        getDownloadURL(ref(storage, 'users/' + this.user.uid)).then((url) => {
          this.src = url;
        }).catch(() => {
          this.src = this.user.photoURL;
        })
      });
    }
    const userRef = this.firestore.collection(`users/`);

    setTimeout(async() => {
      await userRef.doc(this.user.uid).update({
        displayName: displayName,
        photoURL: this.src
      }).then(() => {
        this.user.displayName = displayName;
        this.user.photoURL = this.src;
        localStorage.setItem('user', JSON.stringify(this.user));
        window.alert('Dados atualizados');
      });
    }, 2000)
  }
}
