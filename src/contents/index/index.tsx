import './style.scss';
import { injectCustomJs } from '../../utils/common';
console.log(`Current page show`);
injectCustomJs('lib/mock.js').then(() => {
    injectCustomJs('pageScript/index.ts');
}); // 注入mock js
