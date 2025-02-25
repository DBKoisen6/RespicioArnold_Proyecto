using Microsoft.AspNetCore.Mvc;
using RespicioArnold.Models;
using RespicioArnold.Util;
using System.Data;
using System.Data.SqlClient;

namespace RespicioArnold.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalController : ControllerBase
    {
        private readonly DBConnection connection;

        public PersonalController(IConfiguration configuration)
        {
            connection = new DBConnection(configuration);
        }

        [HttpGet]
        public IActionResult ReadP()
        {
            List<Personal> lista = new List<Personal>();

            using(SqlConnection con = connection.GetConnection())
            {
                using(SqlCommand cmd = new SqlCommand("read_personal", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    using(SqlDataReader r = cmd.ExecuteReader())
                    {
                        while (r.Read())
                        {
                            lista.Add(new Personal
                            {
                                IdPersonal = Convert.ToInt32(r["idPersonal"]),
                                TipoDoc = r["TipoDoc"].ToString(),
                                NumeroDoc = r["NumeroDoc"].ToString(),
                                ApPaterno = r["ApPaterno"].ToString(),
                                ApMaterno = r["ApMaterno"].ToString(),
                                Nombre1 = r["Nombre1"].ToString(),
                                Nombre2 = r["Nombre2"].ToString(),
                                NombreCompleto = r["NombreCompleto"].ToString(),
                                FechaNac = Convert.ToDateTime(r["FechaNac"]),
                                FechaIngreso = Convert.ToDateTime(r["FechaIngreso"])
                            });
                        }
                    }
                }     
            }
            return Ok(lista);
        }

        [HttpPost]
        public IActionResult CreateP([FromBody] Personal personal)
        {
            using(SqlConnection con = connection.GetConnection())
            {
                using(SqlCommand cmd=new SqlCommand("create_personal", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@tipo", personal.TipoDoc);
                    cmd.Parameters.AddWithValue("@num", personal.NumeroDoc);
                    cmd.Parameters.AddWithValue("@pat", personal.ApPaterno);
                    cmd.Parameters.AddWithValue("@mat", personal.ApMaterno);
                    cmd.Parameters.AddWithValue("@nom1", personal.Nombre1);
                    cmd.Parameters.AddWithValue("@nom2", (object)personal.Nombre2 ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@nom", personal.NombreCompleto);
                    cmd.Parameters.AddWithValue("@nac", personal.FechaNac);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok(new {message= "Personal agregado correctamente" });
        }

        [HttpPut("{id}")]
        public IActionResult updateP(int id, [FromBody] Personal personal)
        {
            using (SqlConnection con = connection.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("update_personal", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@tipo", personal.TipoDoc);
                    cmd.Parameters.AddWithValue("@num", personal.NumeroDoc);
                    cmd.Parameters.AddWithValue("@pat", personal.ApPaterno);
                    cmd.Parameters.AddWithValue("@mat", personal.ApMaterno);
                    cmd.Parameters.AddWithValue("@nom1", personal.Nombre1);
                    cmd.Parameters.AddWithValue("@nom2", (object)personal.Nombre2 ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@nom", personal.NombreCompleto);
                    cmd.Parameters.AddWithValue("@nac", personal.FechaNac);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok(new { message = "Personal actualizado correctamente" });
        }

        [HttpDelete("{id}")]
        public IActionResult deleteP(int id)
        {
            using (SqlConnection con = connection.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("delete_personal", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
            return Ok(new { message="Personal eliminado correctamente" });
        }
    }
}
