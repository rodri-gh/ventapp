import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCrrATB-bm1ZTFfMhTGjVpK-2W-v-v1e8k',
    authDomain: 'ventapp-6bc96.firebaseapp.com',
    projectId: 'ventapp-6bc96',
    storageBucket: 'ventapp-6bc96.appspot.com',
    messagingSenderId: '343597188971',
    appId: '1:343597188971:web:79d324e28dcf47ae1dee2e',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
