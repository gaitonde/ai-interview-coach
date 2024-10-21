
Please generate SQL commands to create an initial database schema for a PostgreSQL database for a simple application. The schema should include the following tables:

<entities>
  <entity>
    <name>Profiles</name>
    <description>To store user profile information</description>
    <attributes>
      <attribute>
        <name>school</name>
        <description>The school the user attended</description>
      </attribute>
      <attribute>
        <name>major</name>
        <description>The major the user earned or will earn</description>
      </attribute>
      <attribute>
        <name>concentration</name>
        <description>The concentration the user earned or will earn</description>
      </attribute>
      <attribute>
        <name>graduation_year</name>
        <description>The year the user expects to graduate</description>
      </attribute>
    </attributes>
  </entity>
  <entity>
    <name>Jobs</name>
    <description>To store job information</description>
    <attributes>
      <attribute>
        <name>url</name>
        <description>The URL of the job</description>
      </attribute>
      <attribute>
        <name>text</name>
        <description>The text of the job</description>
      </attribute>
    </attributes>
    <relationships>
      <relationship>
        <description>Each job belongs to 1 and only 1 Profile. A Profile can have 0 or more Jobs.</description>
      </relationship>
    </relationships>
  </entity>
  <entity>
    <name>Resumes</name>
    <description>To store resume information</description>
    <attributes>
      <attribute>
        <name>url</name>
        <description>The URL of the resume</description>
      </attribute>
      <attribute>
        <name>text</name>
        <description>The text of the resume</description>
      </attribute>
    </attributes>
    <relationships>
      <relationship>
        <description>Each Resume belongs to 1 and only 1 Profile. A Profile can 0 or more Resumes.</description>
      </relationship>
    </relationships>
  </entity>
</entities>


For each table, include appropriate columns with suitable data types, primary keys, foreign keys, and any necessary constraints. Each table should be plural, in other words end in "s". Also, for each table add a created_at and last_updated_at timestamps columns.

Please provide the complete SQL script, including CREATE TABLE and INSERT statements, that can be executed directly in a PostgreSQL database. Alos, add some sample INSERT statements to populate each table with a few rows of data.
