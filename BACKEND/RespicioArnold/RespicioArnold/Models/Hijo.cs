namespace RespicioArnold.Models
{
    public class Hijo
    {
        public int IdHijo { get; set; }
        public int IdPersonal { get; set; }
        public string TipoDoc { get; set; }
        public string NumeroDoc { get; set; }
        public string ApPaterno { get; set; }
        public string ApMaterno { get; set; }
        public string Nombre1 { get; set; }
        public string Nombre2 { get; set; }
        public string NombreCompleto { get; set; }
        public DateTime FechaNac { get; set; }
    }
}
