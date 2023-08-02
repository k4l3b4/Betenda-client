export interface CreateRoadMapType {
    goal_name: string,
    goal_desc: string,
    goal_due: string,
}

export interface RoadMapType extends CreateRoadMapType {
    id: number,
    achieved: boolean,
    goal_set: string,
    canceled: boolean,
}

export interface PaginatedRoadMapsType {
    total_items: number,
    page: number,
    page_size: number,
    results: RoadMapType[]
}[]


export interface InfiniteRoadMapsType {
    pageParams: Record<number, number>[],
    pages: PaginatedRoadMapsType[]
}