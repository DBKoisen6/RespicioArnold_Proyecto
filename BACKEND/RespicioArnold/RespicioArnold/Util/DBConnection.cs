using System.Data.SqlClient;

namespace RespicioArnold.Util
{
    public class DBConnection
    {
        private readonly string cn;

        public DBConnection(IConfiguration configuration)
        {
            cn = configuration.GetConnectionString("DefaultConnection");
        }

        public SqlConnection GetConnection()
        {
            SqlConnection con = new SqlConnection(cn);
            return con;
        }
    }
}
