import ImgLogoBranca from '@/assets/logo-w.png';
import ImgLogoPreta from '@/assets/logo-b.png';
export default function Logo({cor = 'branca'}) {
   const logo =
        cor === 'branca'
            ? ImgLogoBranca
            : ImgLogoPreta

    return (
        <img src={logo} alt="Logo, escrito e-loja" />
    )
}
