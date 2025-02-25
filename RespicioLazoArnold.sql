
CREATE DATABASE RespicioArnold;
GO

USE RespicioArnold;
GO

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE PERSONAL
(
    idPersonal     INT IDENTITY(1,1) PRIMARY KEY,
    TipoDoc        VARCHAR(100) NOT NULL,
    NumeroDoc      VARCHAR(50) NOT NULL,
    ApPaterno      VARCHAR(100) NOT NULL,
    ApMaterno      VARCHAR(100) NOT NULL,
    Nombre1        VARCHAR(100) NOT NULL,
    Nombre2        VARCHAR(100) NULL,
    NombreCompleto VARCHAR(1000) NOT NULL,
    FechaNac       DATE NOT NULL,
    FechaIngreso   DATE DEFAULT GETDATE(),
    CONSTRAINT UQ_Personal_NumeroDoc UNIQUE (NumeroDoc)
);
GO

CREATE TABLE HIJO
(
    idHijo         INT IDENTITY(1,1) PRIMARY KEY,
    idPersonal     INT NOT NULL,
    TipoDoc        VARCHAR(100) NOT NULL,
    NumeroDoc      VARCHAR(50) NOT NULL,
    ApPaterno      VARCHAR(100) NOT NULL,
    ApMaterno      VARCHAR(100) NOT NULL,
    Nombre1        VARCHAR(100) NOT NULL,
    Nombre2        VARCHAR(100) NULL,
    NombreCompleto VARCHAR(1000) NOT NULL,
    FechaNac       DATE NOT NULL,
    CONSTRAINT FK_Hijo_Personal FOREIGN KEY (idPersonal) REFERENCES PERSONAL(idPersonal) ON DELETE CASCADE,
    CONSTRAINT UQ_Hijo_NumeroDoc UNIQUE (NumeroDoc)
);
GO

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE read_personal
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM PERSONAL;
END
GO

CREATE PROCEDURE create_personal
@tipo VARCHAR(100),
@num VARCHAR(50),
@pat VARCHAR(100),
@mat VARCHAR(100),
@nom1 VARCHAR(100),
@nom2 VARCHAR(100),
@nom VARCHAR(1000),
@nac DATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM PERSONAL WHERE NumeroDoc=@num)
    BEGIN
        RAISERROR('El número de documento ya existe.',16,1);
        RETURN;
    END
    INSERT INTO PERSONAL(TipoDoc,NumeroDoc,ApPaterno,ApMaterno,Nombre1,Nombre2,NombreCompleto,FechaNac) VALUES (@tipo,@num,@pat,@mat,@nom1,@nom2,@nom,@nac);
END
GO

CREATE PROCEDURE update_personal
@id INT,
@tipo VARCHAR(100),
@num VARCHAR(50),
@pat VARCHAR(100),
@mat VARCHAR(100),
@nom1 VARCHAR(100),
@nom2 VARCHAR(100),
@nom VARCHAR(1000),
@nac DATE
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM PERSONAL WHERE idPersonal=@id)
    BEGIN
        RAISERROR('El personal no existe.',16,1);
        RETURN;
    END
	IF EXISTS (SELECT 1 FROM PERSONAL WHERE NumeroDoc=@num and idPersonal!=@id)
    BEGIN
        RAISERROR('El número de documento ya existe.',16,1);
        RETURN;
    END
    UPDATE PERSONAL SET TipoDoc=@tipo,NumeroDoc=@num,ApPaterno=@pat,ApMaterno=@mat,Nombre1=@nom1,Nombre2=@nom2,NombreCompleto=@nom,FechaNac=@nac WHERE idPersonal=@id;
END
GO

CREATE PROCEDURE delete_personal
@id INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM PERSONAL WHERE idPersonal=@id)
    BEGIN
        RAISERROR('El Personal no existe.',16,1);
        RETURN;
    END
    DELETE FROM PERSONAL WHERE idPersonal=@id;
END
GO

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE read_hijo
@id INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM PERSONAL WHERE idPersonal=@id)
    BEGIN
        RAISERROR('El personal no existe.',16,1);
        RETURN;
    END
    SELECT * FROM HIJO WHERE idPersonal=@id;
END
GO

CREATE PROCEDURE create_hijo
@id INT,
@tipo VARCHAR(100),
@num VARCHAR(50),
@pat VARCHAR(100),
@mat VARCHAR(100),
@nom1 VARCHAR(100),
@nom2 VARCHAR(100),
@nom VARCHAR(1000),
@nac DATE
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM PERSONAL WHERE idPersonal=@id)
    BEGIN
        RAISERROR('El personal no existe.',16,1);
        RETURN;
    END
    IF EXISTS (SELECT 1 FROM HIJO WHERE NumeroDoc=@num)
    BEGIN
        RAISERROR('El número de documento ya existe.',16,1);
        RETURN;
    END
	IF EXISTS (SELECT 1 FROM PERSONAL WHERE NumeroDoc=@num)
    BEGIN
        RAISERROR('El número de documento ya existe en un personal.',16,1);
        RETURN;
    END
    INSERT INTO HIJO(idPersonal,TipoDoc,NumeroDoc,ApPaterno,ApMaterno,Nombre1,Nombre2,NombreCompleto,FechaNac) VALUES (@id,@tipo,@num,@pat,@mat,@nom1,@nom2,@nom,@nac);
END
GO

CREATE PROCEDURE update_hijo
@id INT,
@tipo VARCHAR(100),
@num VARCHAR(50),
@pat VARCHAR(100),
@mat VARCHAR(100),
@nom1 VARCHAR(100),
@nom2 VARCHAR(100),
@nom VARCHAR(1000),
@nac DATE
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM HIJO WHERE idHijo=@id)
    BEGIN
        RAISERROR('El hijo no existe.',16,1);
        RETURN;
    END
	IF EXISTS (SELECT 1 FROM HIJO WHERE NumeroDoc=@num and idHijo!=@id)
    BEGIN
        RAISERROR('El número de documento ya existe.',16,1);
        RETURN;
    END
	IF EXISTS (SELECT 1 FROM PERSONAL WHERE NumeroDoc=@num)
    BEGIN
        RAISERROR('El número de documento ya existe en un personal.',16,1);
        RETURN;
    END
    UPDATE HIJO SET TipoDoc=@tipo,NumeroDoc=@num,ApPaterno=@pat,ApMaterno=@mat,Nombre1=@nom1,Nombre2=@nom2,NombreCompleto=@nom,FechaNac=@nac WHERE idHijo=@id;
END
GO

CREATE PROCEDURE delete_hijo
@id INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM HIJO WHERE idHijo=@id)
    BEGIN
        RAISERROR('El hijo no existe.',16,1);
        RETURN;
    END
    DELETE FROM HIJO WHERE idHijo=@id;
END
GO
