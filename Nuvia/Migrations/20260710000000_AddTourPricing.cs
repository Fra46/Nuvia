using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nuvia.Migrations
{
    public partial class AddTourPricing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TourPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TourId = table.Column<int>(type: "int", nullable: false),
                    MinPeople = table.Column<int>(type: "int", nullable: false),
                    MaxPeople = table.Column<int>(type: "int", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourPricings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourPricings_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TourPricings_TourId",
                table: "TourPricings",
                column: "TourId");

            // Migrate existing PricePerPerson into a default rate per tour
            migrationBuilder.Sql(@"
                INSERT INTO TourPricings (TourId, MinPeople, MaxPeople, TotalPrice, CreatedAt)
                SELECT Id, 1, CASE WHEN AvailableSlots > 0 THEN AvailableSlots ELSE 999 END, PricePerPerson * 1, GETUTCDATE()
                FROM Tours
                WHERE PricePerPerson IS NOT NULL AND PricePerPerson > 0
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TourPricings");
        }
    }
}
