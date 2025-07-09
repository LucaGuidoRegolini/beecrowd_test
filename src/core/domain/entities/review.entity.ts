export class Review {
  constructor(
    public readonly id: string,
    public readonly movieId: string,
    public readonly userOpinion: string,
    public readonly userRating: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Review {
    return new Review(
      crypto.randomUUID(),
      props.movieId,
      props.userOpinion,
      props.userRating,
      new Date(),
      new Date(),
    );
  }
}
