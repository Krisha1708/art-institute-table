// Basic TypeScript Interface - defines the shape of an Artwork object
export interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscription: string;
    date_start: number;
    date_end: number;
}

// Basic TypeScript Interface - defines the API response structure
export interface ApiResponse {
    data: Artwork[];
    pagination: {
        total: number;
        current_page: number;
        limit: number;
    };
}

