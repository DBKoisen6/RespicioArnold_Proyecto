using Microsoft.AspNetCore.Mvc;
using RespicioArnold.Models;
using RespicioArnold.Util;
using System.Data.SqlClient;
using System.Data;

namespace RespicioArnold.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HijoController : ControllerBase
    {
        private readonly DBConnection connection;

        public HijoController(IConfiguration configuration)
        {
            connection = new DBConnection(configuration);
        }

        [HttpGet("personal/{id}")]
        public IActionResult ReadH(int id)
        {
            List<Hijo> lista = new List<Hijo>();

            using (SqlConnection con = connection.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("read_hijo", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    using (SqlDataReader r = cmd.ExecuteReader())
                    {
                        while (r.Read())
                        {
                            lista.Add(new Hijo
                            {
                                IdHijo = r.GetInt32(r.GetOrdinal("idHijo")),
                                IdPersonal = r.GetInt32(r.GetOrdinal("idPersonal")),
                                TipoDoc = r.GetString(r.GetOrdinal("TipoDoc")),
                                NumeroDoc = r.GetString(r.GetOrdinal("NumeroDoc")),
                                ApPaterno = r.GetString(r.GetOrdinal("ApPaterno")),
                                ApMaterno = r.GetString(r.GetOrdinal("ApMaterno")),
                                Nombre1 = r.GetString(r.GetOrdinal("Nombre1")),
                                Nombre2 = r.IsDBNull(r.GetOrdinal("Nombre2")) ? "" : r.GetString(r.GetOrdinal("Nombre2")),
                                NombreCompleto = r.GetString(r.GetOrdinal("NombreCompleto")),
                                FechaNac = r.GetDateTime(r.GetOrdinal("FechaNac"))
                            });
                        }
                    }
                }
            }
            return Ok(lista);
        }

        [HttpPost]
        public IActionResult CreateH([FromBody] Hijo hijo)
        {
            using (SqlConnection con = connection.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("create_hijo", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", hijo.IdPersonal);
                    cmd.Parameters.AddWithValue("@tipo", hijo.TipoDoc);
                    cmd.Parameters.AddWithValue("@num", hijo.NumeroDoc);
                    cmd.Parameters.AddWithValue("@pat", hijo.ApPaterno);
                    cmd.Parameters.AddWithValue("@mat", hijo.ApMaterno);
                    cmd.Parameters.AddWithValue("@nom1", hijo.Nombre1);
                    cmd.Parameters.AddWithValue("@nom2", (object)hijo.Nombre2 ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@nom", hijo.NombreCompleto);
                    cmd.Parameters.AddWithValue("@nac", hijo.FechaNac);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok(new { message = "Hijo agregado correctamente"});
        }

        [HttpPut("{id}")]
        public IActionResult UpdateH(int id, [FromBody] Hijo hijo)
        {
            using (SqlConnection con = connection.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("update_hijo", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@tipo", hijo.TipoDoc);
                    cmd.Parameters.AddWithValue("@num", hijo.NumeroDoc);
                    cmd.Parameters.AddWithValue("@pat", hijo.ApPaterno);
                    cmd.Parameters.AddWithValue("@mat", hijo.ApMaterno);
                    cmd.Parameters.AddWithValue("@nom1", hijo.Nombre1);
                    cmd.Parameters.AddWithValue("@nom2", (object)hijo.Nombre2 ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@nom", hijo.NombreCompleto);
                    cmd.Parameters.AddWithValue("@nac", hijo.FechaNac);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok(new { message = "Hijo actualizado correctamente" });
        }
        [HttpDelete("{id}")]
        public IActionResult deleteH(int id)
        {
            using (SqlConnection con = connection.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("delete_hijo", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok(new { meesage = "Hijo eliminado correctamente" });
        }
    }
}
