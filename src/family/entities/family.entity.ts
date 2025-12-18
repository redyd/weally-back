export class FamilyClient {
  private readonly id: number;
  private readonly name: string;
  private readonly created_at: Date;
  private readonly updated_at: Date;

  constructor(data: {
    name: string,
    createdAt: Date,
    updatedAt: Date,
    id: number;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.created_at = data.createdAt;
    this.updated_at = data.updatedAt;
  }
}
