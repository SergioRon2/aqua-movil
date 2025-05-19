import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';
import { aquaApi } from 'config/api/aqua-api';

export class ExportsService {
    static downloadFile = async (id: number) => {
        try {
            const response = await aquaApi.get(`/download_file/${id}`, {
                responseType: 'arraybuffer',
            });

            // Detectar tipo de archivo
            const contentType = response.headers['content-type'];
            const extension = contentType.split('/')[1] || 'bin';

            // Ruta temporal con extensión dinámica
            const fileUri = `${FileSystem.documentDirectory}archivo_${id}.${extension}`;

            const base64 = Buffer.from(response.data, 'binary').toString('base64');

            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Compartir
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                console.warn('⚠️ Sharing no disponible');
            }

            return fileUri;

        } catch (error) {
            console.error('❌ Error al descargar el archivo:', error);
        }
    };
}
