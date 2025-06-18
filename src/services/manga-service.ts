import { api } from "@api/api";

export class MangaService {
    static getListManga = async () => {
        const response = await api.get('/manga');
        return response.data;
    }
}

